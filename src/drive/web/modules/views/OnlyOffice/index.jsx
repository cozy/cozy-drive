import React, { createContext, useState } from 'react'

import flag from 'cozy-flags'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Dialog from 'cozy-ui/transpiled/react/Dialog'

import Editor from 'drive/web/modules/views/OnlyOffice/Editor'

export const OnlyOfficeContext = createContext()

const OnlyOfficeProvider = ({
  fileId,
  isPublic,
  isFromSharing,
  username,
  isInSharedFolder,
  children
}) => {
  const { isMobile } = useBreakpoints()
  const [isEditorReadOnly, setIsEditorReadOnly] = useState()
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [isEditorForcedReadOnly, setIsEditorForcedReadOnly] = useState(
    isMobile || flag('drive.onlyoffice.forceReadOnlyOnDesktop')
  )

  return (
    <OnlyOfficeContext.Provider
      value={{
        fileId,
        isPublic,
        isFromSharing,
        username,
        isInSharedFolder,
        isEditorReadOnly,
        setIsEditorReadOnly,
        isEditorReady,
        setIsEditorReady,
        isEditorForcedReadOnly,
        setIsEditorForcedReadOnly
      }}
    >
      {children}
    </OnlyOfficeContext.Provider>
  )
}

const OnlyOffice = ({
  params: { fileId },
  isPublic,
  isFromSharing,
  username,
  isInSharedFolder
}) => {
  return (
    <Dialog open={true} fullScreen transitionDuration={0}>
      <OnlyOfficeProvider
        fileId={fileId}
        isPublic={isPublic}
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
