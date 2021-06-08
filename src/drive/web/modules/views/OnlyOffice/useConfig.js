import { useContext, useEffect, useState } from 'react'

import { isQueryLoading } from 'cozy-client'
import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'
import { generateWebLink } from 'cozy-client'

import {
  isOnlyOfficeReadOnly,
  shouldBeOpenedOnOtherInstance,
  isOnlyOfficeEnabled,
  makeUsername
} from 'drive/web/modules/views/OnlyOffice/helpers'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'

const useConfig = () => {
  const {
    fileId,
    isEditorReadOnly,
    setIsEditorReadOnly,
    setIsEditorReady,
    isPublic,
    publicNameFromSharing,
    isEditorForcedReadOnly
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
      setConfig()
    },
    [isEditorForcedReadOnly]
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
            sharecode,
            public_name
          } = data.data.attributes

          const searchParams = [['sharecode', sharecode]]
          searchParams.push(['isOnlyOfficeDocShared', true])
          searchParams.push(['onlyOfficeDocId', document_id])
          if (public_name)
            searchParams.push(['publicNameFromSharing', public_name])

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

          const { attributes } = data.data
          const { onlyoffice, public_name } = attributes
          const username = makeUsername({
            isPublic,
            publicNameFromSharing,
            public_name
          })

          const serverUrl = onlyoffice.url
          const apiUrl = `${serverUrl}/web-apps/apps/api/documents/api.js`
          const docEditorConfig = {
            // complete config doc : https://api.onlyoffice.com/editors/advanced
            document: onlyoffice.document,
            editorConfig: {
              ...onlyoffice.editor,
              mode: isEditorForcedReadOnly ? 'view' : onlyoffice.editor.mode,
              user: { name: username }
            },
            token: onlyoffice.token,
            documentType: onlyoffice.documentType,
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
      isPublic,
      isEditorForcedReadOnly,
      publicNameFromSharing
    ]
  )

  return { config, status }
}

export default useConfig
