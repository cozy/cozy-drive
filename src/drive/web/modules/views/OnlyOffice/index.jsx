import React, { createContext, useState, useMemo, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import Dialog from 'cozy-ui/transpiled/react/Dialog'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

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
  const { pathname } = useLocation()

  const [isEditorReady, setIsEditorReady] = useState(false)

  const [editorMode, setEditorMode] = useState(
    officeDefaultMode(isDesktop, isMobile)
  )
  const isEditorModeView = useMemo(() => editorMode === 'view', [editorMode])

  const isFromCreate = useMemo(
    () => pathname.endsWith('/fromCreate'),
    [pathname]
  )

  useEffect(() => {
    if (isFromCreate) {
      setEditorMode('edit')
    }
  }, [isFromCreate])

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
        isEditorModeView,
        isFromCreate
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
