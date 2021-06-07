import { useContext, useEffect, useState } from 'react'

import { isQueryLoading } from 'cozy-client'
import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'
import { generateWebLink } from 'cozy-client'

import {
  isOnlyOfficeReadOnly,
  shouldBeOpenedOnOtherInstance,
  isOnlyOfficeEnabled
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
  const [status, setStatus] = useState('loading')

  const queryResult = useFetchJSON('GET', `/office/${fileId}/open`)
  const { data, fetchStatus } = queryResult

  useEffect(
    () => {
      setStatus(fetchStatus)
    },
    [fetchStatus]
  )

  useEffect(
    () => {
      if (!isQueryLoading(queryResult) && fetchStatus !== 'error' && !config) {
        if (!isPublic && shouldBeOpenedOnOtherInstance(data)) {
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
        } else if (isOnlyOfficeEnabled()) {
          if (isEditorReadOnly !== isOnlyOfficeReadOnly(data)) {
            setIsEditorReadOnly(isOnlyOfficeReadOnly(data))
          }

          const onlyOffice = data.data.attributes.onlyoffice
          const serverUrl = onlyOffice.url
          const apiUrl = `${serverUrl}web-apps/apps/api/documents/api.js`
          const docEditorConfig = {
            // complete config doc : https://api.onlyoffice.com/editors/advanced
            document: onlyOffice.document,
            editorConfig: onlyOffice.editor,
            token: onlyOffice.token,
            documentType: onlyOffice.documentType,
            events: {
              onAppReady: () => setIsEditorReady(true)
            }
          }

          setConfig({ serverUrl, apiUrl, docEditorConfig })
        } else {
          setStatus('error')
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

  return { config, status }
}

export default useConfig
