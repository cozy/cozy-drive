import React from 'react'
import Container from './Container'
export { default as FileOpenerExternal } from './FileOpenerExternal.jsx'
export { default as SharingsContainer } from './SharingsContainer.jsx'

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
