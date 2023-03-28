import { useContext, useEffect, useState } from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import { useClient, isQueryLoading, generateWebLink } from 'cozy-client'
import useFetchJSON from 'cozy-client/dist/hooks/useFetchJSON'

import {
  shouldBeOpenedOnOtherInstance,
  isOfficeEnabled,
  makeName
} from 'drive/web/modules/views/OnlyOffice/helpers'
import { OnlyOfficeContext } from 'drive/web/modules/views/OnlyOffice'

const useConfig = () => {
  const {
    fileId,
    setIsEditorReady,
    isPublic,
    username,
    isFromSharing,
    editorMode,
    isEditorModeView
  } = useContext(OnlyOfficeContext)
  const client = useClient()
  const instanceUri = client.getStackClient().uri

  const [config, setConfig] = useState()
  const [status, setStatus] = useState('loading')

  const queryResult = useFetchJSON('GET', `/office/${fileId}/open`)
  const { data, fetchStatus } = queryResult
  const { isDesktop } = useBreakpoints()

  useEffect(() => {
    setStatus(fetchStatus)
  }, [fetchStatus])

  useEffect(() => {
    setConfig()
  }, [isEditorModeView])

  useEffect(() => {
    if (!isQueryLoading(queryResult) && fetchStatus !== 'error' && !config) {
      if (shouldBeOpenedOnOtherInstance(data, instanceUri)) {
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
        if (public_name) searchParams.push(['username', public_name])

        const link = generateWebLink({
          cozyUrl: `${protocol}://${instance}`,
          searchParams,
          pathname: '/public/',
          slug: 'drive',
          subDomainType: subdomain
        })

        window.location = link
      } else if (isOfficeEnabled(isDesktop)) {
        const { attributes } = data.data
        const { onlyoffice, public_name } = attributes
        const name = makeName({
          isPublic,
          isFromSharing,
          username,
          public_name
        })

        const serverUrl = onlyoffice.url
        const apiUrl = `${serverUrl}/web-apps/apps/api/documents/api.js`
        const docEditorConfig = {
          // complete config doc : https://api.onlyoffice.com/editors/advanced
          document: onlyoffice.document,
          editorConfig: {
            ...onlyoffice.editor,
            mode: onlyoffice.editor.mode === 'edit' ? editorMode : 'view',
            user: { name }
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
  }, [
    editorMode,
    queryResult,
    fetchStatus,
    data,
    config,
    setConfig,
    setIsEditorReady,
    isPublic,
    username,
    isFromSharing,
    instanceUri,
    isDesktop
  ])

  return { config, status }
}

export default useConfig
