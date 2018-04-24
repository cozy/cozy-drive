import React from 'react'
import Container from './Container'
export { default as FileOpenerExternal } from './FileOpenerExternal.jsx'

export const FolderContainer = props => (
  <Container
    isTrashContext={false}
    canSort
    canUpload
    canCreateFolder
    {...props}
  />
)
export const RecentContainer = props => (
  <Container
    isTrashContext={false}
    canSort={false}
    canUpload={false}
    canCreateFolder={false}
    withFilePath
    {...props}
  />
)
