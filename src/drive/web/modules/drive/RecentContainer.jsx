import React from 'react'

import Container from './Container'

const RecentContainer = props => {
  return (
    <Container
      isTrashContext={false}
      canSort={false}
      canDrop={false}
      canUpload={false}
      canCreateFolder={false}
      canMove={false}
      withFilePath
      {...props}
    />
  )
}

export default RecentContainer
