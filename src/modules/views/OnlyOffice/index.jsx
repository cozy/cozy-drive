import React from 'react'
import { useParams, Outlet } from 'react-router-dom'

import Dialog from 'cozy-ui/transpiled/react/Dialog'

import useHead from 'components/useHead'
import Editor from 'modules/views/OnlyOffice/Editor'
import { OnlyOfficeProvider } from 'modules/views/OnlyOffice/OnlyOfficeProvider'

const OnlyOffice = ({
  isPublic,
  isReadOnly = false,
  isFromSharing,
  username,
  isInSharedFolder
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
        <Outlet />
      </OnlyOfficeProvider>
    </Dialog>
  )
}

export default OnlyOffice
