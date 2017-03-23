import styles from '../styles/topbar'

import React from 'react'
import { withRouter } from 'react-router'

import FilesToolbar from '../containers/FilesToolbar'
import TrashToolbar from '../containers/TrashToolbar'
import Breadcrumb from '../containers/Breadcrumb'

// TODO: move the Topbar into FolderView so that we can get rid of this
import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config'
const getToolbar = location => {
  if (location.pathname.match(/^\/files/)) return FilesToolbar
  if (location.pathname.match(/^\/trash/)) return TrashToolbar
}

const Topbar = ({ location }) => {
  const Toolbar = getToolbar(location)
  return (
    <div class={styles['fil-content-header']}>
      <Breadcrumb />
      <Toolbar />
    </div>
  )
}

export default withRouter(Topbar)
