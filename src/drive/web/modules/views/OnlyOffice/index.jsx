import React, { createContext, useState, useMemo, useEffect } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'

import Dialog from 'cozy-ui/transpiled/react/Dialog'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import Editor from 'drive/web/modules/views/OnlyOffice/Editor'
import useHead from 'components/useHead'
import { officeDefaultMode } from 'drive/web/modules/views/OnlyOffice/helpers'

export const OnlyOfficeContext = createContext()

const OnlyOfficeProvider = ({
  fileId,
  isPublic,
  isReadOnly,
  isFromSharing,
  username,
  isInSharedFolder,
  children
}) => {
  const { isDesktop, isMobile } = useBreakpoints()
  const [searchParam] = useSearchParams()
  const [isEditorReady, setIsEditorReady] = useState(false)

  const [editorMode, setEditorMode] = useState(
    officeDefaultMode(isDesktop, isMobile)
  )
  const isEditorModeView = useMemo(() => editorMode === 'view', [editorMode])

  useEffect(() => {
    if (searchParam.get('fromCreate') === 'true') {
      setEditorMode('edit')
    }
  }, [searchParam])

  return (
    <OnlyOfficeContext.Provider
      value={{
        fileId,
        isPublic,
        isReadOnly,
        isFromSharing,
        username,
        isInSharedFolder,
        isEditorReady,
        setIsEditorReady,
        editorMode,
        setEditorMode,
        isEditorModeView
      }}
    >
      {children}
    </OnlyOfficeContext.Provider>
  )
}

const OnlyOffice = ({
  isPublic,
  isReadOnly = false,
  isFromSharing,
  username,
  isInSharedFolder,
  children
}) => {
  const { fileId } = useParams()
  useHead()

  return (
    <Dialog open={true} fullScreen transitionDuration={0}>
      <OnlyOfficeProvider
        fileId={fileId}
        isPublic={isPublic}
        isReadOnly={isReadOnly}
        isFromSharing={isFromSharing}
        username={username}
        isInSharedFolder={isInSharedFolder}
      >
        <Editor />
        {children}
      </OnlyOfficeProvider>
    </Dialog>
  )
}

export default OnlyOffice
