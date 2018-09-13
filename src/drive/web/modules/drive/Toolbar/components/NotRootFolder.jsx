/* global cozy */
import React from 'react'

import containerButton from 'drive/web/modules/drive/Toolbar/containers/button'
const NotRootFolder = ({ notRootfolder, children }) => {
  if (notRootfolder) {
    return children
  }
  return null
}

export default containerButton(NotRootFolder)
