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
  const { fileId, isReadOnly, setIsReadOnly } = useContext(OnlyOfficeContext)
  const [config, setConfig] = useState()

  const queryResult = useFetchJSON('GET', `/office/${fileId}/open`)
  const { data, fetchStatus } = queryResult

  useEffect(
    () => {
      if (!isQueryLoading(queryResult) && fetchStatus !== 'error' && !config) {
        if (isSharedWithMe(data)) {
          const {
            protocol,
            instance,
            document_id,
            subdomain
          } = data.data.attributes

          const link = generateWebLink({
            cozyUrl: `${protocol}://${instance}`,
            pathname: '',
            hash: `/onlyoffice/${document_id}/fromSharing`,
            slug: 'drive',
            subDomainType: subdomain
          })

          return (window.location = link)
        }

        if (isReadOnly !== isOnlyOfficeReadOnly(data)) {
          setIsReadOnly(isOnlyOfficeReadOnly(data))
        }

        setConfig(makeConfig(data))
      }
    },
    [
      queryResult,
      fetchStatus,
      data,
      isReadOnly,
      setIsReadOnly,
      config,
      setConfig
    ]
  )

  return { config, status: fetchStatus }
}

export default useConfig
