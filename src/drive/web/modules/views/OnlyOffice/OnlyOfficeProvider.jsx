import React, {
  createContext,
  useState,
  useMemo,
  useEffect,
  useContext,
  useCallback
} from 'react'
import { useSearchParams } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useClient, useQuery } from 'cozy-client'

import { buildFileByIdQuery } from 'drive/web/modules/queries'
import { officeDefaultMode } from 'drive/web/modules/views/OnlyOffice/helpers'

const OnlyOfficeContext = createContext()

const OnlyOfficeProvider = ({
  fileId,
  isPublic,
  isReadOnly,
  isFromSharing,
  username,
  isInSharedFolder,
  children
}) => {
  const client = useClient()
  const { isDesktop, isMobile } = useBreakpoints()
  const [searchParam] = useSearchParams()
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [editorMode, setEditorMode] = useState(
    officeDefaultMode(isDesktop, isMobile)
  )

  const [hasFileDiverged, setFileDiverged] = useState(false)
  const [hasFileDeleted, setFileDeleted] = useState(false)
  const [officeKey, setOfficeKey] = useState(null)
  const [isTrashed, setTrashed] = useState(false)

  const isEditorModeView = useMemo(() => editorMode === 'view', [editorMode])

  const fileQuery = buildFileByIdQuery(fileId)
  const fileResult = useQuery(fileQuery.definition, fileQuery.options)

  const handleFileUpdated = useCallback(
    data => {
      /**
       * To determine whether a file has diverged between its version on the cozy-stack and its version on the onlyoffice server, we use 2 criteria:
       * - That its content has changed with md5sum
       * - That this modification was not made by the onlyoffice server
       */
      if (
        fileResult?.data?.md5sum !== data.md5sum &&
        data.cozyMetadata.uploadedBy.slug !== 'onlyoffice-server'
      ) {
        setFileDiverged(true)
      }
      if (data.trashed) {
        setFileDeleted(true)
      }
    },
    [fileResult?.data?.md5sum]
  )

  useEffect(() => {
    const realtime = client.plugins.realtime
    realtime.subscribe('updated', 'io.cozy.files', fileId, handleFileUpdated)
    return () => {
      realtime.unsubscribe(
        'updated',
        'io.cozy.files',
        fileId,
        handleFileUpdated
      )
    }
  }, [client, fileId, handleFileUpdated])

  useEffect(() => {
    if (
      searchParam.get('fromCreate') === 'true' ||
      searchParam.get('fromEdit') === 'true'
    ) {
      setEditorMode('edit')
    }
  }, [searchParam])

  useEffect(() => {
    if (fileResult.data?.trashed) {
      setTrashed(true)
      setEditorMode('view')
    } else {
      setTrashed(false)
    }
  }, [fileResult])

  return (
    <OnlyOfficeContext.Provider
      value={{
        fileId,
        hasFileDiverged,
        setFileDiverged,
        hasFileDeleted,
        setFileDeleted,
        isPublic,
        isReadOnly,
        isFromSharing,
        username,
        isInSharedFolder,
        isEditorReady,
        setIsEditorReady,
        editorMode,
        setEditorMode,
        isEditorModeView,
        setOfficeKey,
        officeKey,
        isTrashed
      }}
    >
      {children}
    </OnlyOfficeContext.Provider>
  )
}

const useOnlyOfficeContext = () => useContext(OnlyOfficeContext)

export { OnlyOfficeContext, OnlyOfficeProvider, useOnlyOfficeContext }
