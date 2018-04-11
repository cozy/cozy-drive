import React from 'react'
import Container from './Container'
export { default as FileOpenerExternal } from './FileOpenerExternal.jsx'

export const FolderContainer = props => (
  <Container isTrashContext={false} canUpload canCreateFolder {...props} />
)
export const RecentContainer = props => (
  <Container
    isTrashContext={false}
    canUpload={false}
    canCreateFolder={false}
    withFilePath
    {...props}
  />
)
