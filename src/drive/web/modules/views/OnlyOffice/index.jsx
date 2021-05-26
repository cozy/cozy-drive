import React, { createContext, useState } from 'react'

import Dialog from 'cozy-ui/transpiled/react/Dialog'

import Editor from 'drive/web/modules/views/OnlyOffice/Editor'

export const OnlyOfficeContext = createContext()

const OnlyOfficeProvider = ({ fileId, isPublic, children }) => {
  const [isReadOnly, setIsReadOnly] = useState()
  const [isEditorReady, setIsEditorReady] = useState(false)

  return (
    <OnlyOfficeContext.Provider
      value={{
        fileId,
        isPublic,
        isReadOnly,
        setIsReadOnly,
        isEditorReady,
        setIsEditorReady
      }}
    >
      {children}
    </OnlyOfficeContext.Provider>
  )
}

const OnlyOffice = ({ params: { fileId }, isPublic }) => {
  return (
    <Dialog open={true} fullScreen transitionDuration={0}>
      <OnlyOfficeProvider fileId={fileId} isPublic={isPublic}>
        <Editor />
      </OnlyOfficeProvider>
    </Dialog>
  )
}

export default OnlyOffice
