import React from 'react'
import Container from './Container'
export { default as FileOpener } from './FileOpener'

export const FolderContainer = props => (
  <Container isTrashContext={false} canUpload canCreateFolder {...props} />
)
export const RecentContainer = props => (
  <Container
    isTrashContext={false}
    canUpload={false}
    canCreateFolder={false}
    {...props}
  />
)
