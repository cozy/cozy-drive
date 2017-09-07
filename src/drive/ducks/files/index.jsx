import React from 'react'
import Container from './Container'

export const FolderContainer = (props) => <Container isTrashContext={false} canUpload canCreateFolder {...props} />
export const RecentContainer = (props) => <Container isTrashContext={false} canUpload={false} canCreateFolder={false} {...props} />
