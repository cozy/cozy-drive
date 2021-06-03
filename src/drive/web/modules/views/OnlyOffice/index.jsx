import React, { createContext, useState } from 'react'

import Dialog from 'cozy-ui/transpiled/react/Dialog'

import Editor from 'drive/web/modules/views/OnlyOffice/Editor'

export const OnlyOfficeContext = createContext()

const OnlyOfficeProvider = ({ fileId, isPublic, isFromSharing, children }) => {
  const [isEditorReadOnly, setIsEditorReadOnly] = useState()
  const [isEditorReady, setIsEditorReady] = useState(false)

  return (
    <OnlyOfficeContext.Provider
      value={{
        fileId,
        isPublic,
        isFromSharing,
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

const OnlyOffice = ({ params: { fileId }, isPublic, isFromSharing }) => {
  return (
    <Dialog open={true} fullScreen transitionDuration={0}>
      <OnlyOfficeProvider
        fileId={fileId}
        isPublic={isPublic}
        isFromSharing={isFromSharing}
      >
        <Editor />
      </OnlyOfficeProvider>
    </Dialog>
  )
}

export default OnlyOffice
