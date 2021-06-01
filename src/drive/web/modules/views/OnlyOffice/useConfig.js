import { useContext, useEffect, useState } from 'react'

import { isQueryLoading } from 'cozy-client'
import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'
import { generateWebLink } from 'cozy-client'

import {
  isOnlyOfficeReadOnly,
  makeConfig,
  isSharedWithMe
} from 'drive/web/modules/views/OnlyOffice/helpers'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'

const useConfig = () => {
  const {
    fileId,
    isEditorReadOnly,
    setIsEditorReadOnly,
    setIsEditorReady,
    isPublic
  } = useContext(OnlyOfficeContext)
  const [config, setConfig] = useState()

  const queryResult = useFetchJSON('GET', `/office/${fileId}/open`)
  const { data, fetchStatus } = queryResult

  useEffect(
    () => {
      if (!isQueryLoading(queryResult) && fetchStatus !== 'error' && !config) {
        if (!isPublic && isSharedWithMe(data)) {
          const {
            protocol,
            instance,
            document_id,
            subdomain,
            sharecode
          } = data.data.attributes

          const searchParams = [['sharecode', sharecode]]
          searchParams.push(['isOnlyOfficeDocShared', true])
          searchParams.push(['onlyOfficeDocId', document_id])

          const link = generateWebLink({
            cozyUrl: `${protocol}://${instance}`,
            searchParams,
            pathname: '/public/',
            slug: 'drive',
            subDomainType: subdomain
          })

          window.location = link
        } else {
          if (isEditorReadOnly !== isOnlyOfficeReadOnly(data)) {
            setIsEditorReadOnly(isOnlyOfficeReadOnly(data))
          }

          setConfig(
            makeConfig(data, {
              events: {
                onAppReady: () => setIsEditorReady(true)
              }
            })
          )
        }
      }
    },
    [
      queryResult,
      fetchStatus,
      data,
      isEditorReadOnly,
      setIsEditorReadOnly,
      config,
      setConfig,
      setIsEditorReady,
      isPublic
    ]
  )

  return { config, status: fetchStatus }
}

export default useConfig
