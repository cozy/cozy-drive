import React from 'react'
import Container from './Container'
export { default as FileOpenerExternal } from './FileOpenerExternal.jsx'

export const FolderContainer = props => (
  <Container
    isTrashContext={false}
    canSort
    canDrop
    canUpload
    canCreateFolder
    {...props}
  />
)
export const RecentContainer = props => (
  <Container
    isTrashContext={false}
    canSort={false}
    canDrop={false}
    canUpload={false}
    canCreateFolder={false}
    withFilePath
    {...props}
  />
)
export const SharingsContainer = props => (
  <Container
    isTrashContext={false}
    canSort
    canDrop
    canUpload
    canCreateFolder={false}
    {...props}
  />
)
