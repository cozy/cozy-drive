import React, { createContext, useState, useMemo, useEffect } from 'react'

import Dialog from 'cozy-ui/transpiled/react/Dialog'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { useRouter } from 'drive/lib/RouterContext'
import Editor from 'drive/web/modules/views/OnlyOffice/Editor'
import useHead from 'components/useHead'
import { onlyOfficeDefaultMode } from 'drive/web/modules/views/OnlyOffice/helpers'

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
  const { router } = useRouter()
  const { isDesktop, isMobile } = useBreakpoints()

  const [isEditorReady, setIsEditorReady] = useState(false)

  const [editorMode, setEditorMode] = useState(
    onlyOfficeDefaultMode(isDesktop, isMobile)
  )
  const isEditorModeView = useMemo(() => {
    return editorMode === 'view'
  }, [editorMode])

  const isFromCreate = useMemo(
    () => router.location.pathname.endsWith('/fromCreate'),
    [router]
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
  params: { fileId },
  isPublic,
  isReadOnly = false,
  isFromSharing,
  username,
  isInSharedFolder,
  children
}) => {
  useHead({ fileId })

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
