import React from 'react'

import Container from './Container'

const FolderContainer = props => (
  <Container
    isTrashContext={false}
    canSort
    canDrop
    canUpload
    canCreateFolder
    canMove
    {...props}
  />
)

export default FolderContainer
