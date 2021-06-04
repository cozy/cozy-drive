import React, { createContext, useState } from 'react'

import Dialog from 'cozy-ui/transpiled/react/Dialog'

import Editor from 'drive/web/modules/views/OnlyOffice/Editor'

export const OnlyOfficeContext = createContext()

const OnlyOfficeProvider = ({
  fileId,
  isPublic,
  isFromSharing,
  isInSharedFolder,
  children
}) => {
  const [isEditorReadOnly, setIsEditorReadOnly] = useState()
  const [isEditorReady, setIsEditorReady] = useState(false)

  return (
    <OnlyOfficeContext.Provider
      value={{
        fileId,
        isPublic,
        isFromSharing,
        isInSharedFolder,
        isEditorReadOnly,
        setIsEditorReadOnly,
        isEditorReady,
        setIsEditorReady
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
  isInSharedFolder
}) => {
  return (
    <Dialog open={true} fullScreen transitionDuration={0}>
      <OnlyOfficeProvider
        fileId={fileId}
        isPublic={isPublic}
        isFromSharing={isFromSharing}
        isInSharedFolder={isInSharedFolder}
      >
        <Editor />
      </OnlyOfficeProvider>
    </Dialog>
  )
}

export default OnlyOffice
