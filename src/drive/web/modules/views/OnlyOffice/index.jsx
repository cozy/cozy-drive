import React, { createContext, useState, useMemo, useEffect } from 'react'

import Dialog from 'cozy-ui/transpiled/react/Dialog'

import { useRouter } from 'drive/lib/RouterContext'
import Editor from 'drive/web/modules/views/OnlyOffice/Editor'
import useHead from 'components/useHead'

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

  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isEditorForcedReadOnly, setIsEditorForcedReadOnly] = useState(true)

  const isFromCreate = useMemo(
    () => router.location.pathname.endsWith('/fromCreate'),
    [router]
  )

  useEffect(() => {
    if (isFromCreate) {
      setIsEditorForcedReadOnly(false)
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
        isEditorForcedReadOnly,
        setIsEditorForcedReadOnly,
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
  isInSharedFolder
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
      </OnlyOfficeProvider>
    </Dialog>
  )
}

export default OnlyOffice
