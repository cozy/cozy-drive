import React from 'react'

import Topbar from '@/modules/layout/Topbar'

const FolderViewHeader = ({ children, hideOnMobile }) => {
  return <Topbar hideOnMobile={hideOnMobile}>{children}</Topbar>
}

export default FolderViewHeader
