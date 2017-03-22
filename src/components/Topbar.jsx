import styles from '../styles/topbar'

import React from 'react'
import { connect } from 'react-redux'

import FilesToolbar from '../containers/FilesToolbar'
import TrashToolbar from '../containers/TrashToolbar'
import Breadcrumb from '../containers/Breadcrumb'

import { ROOT_DIR_ID, TRASH_DIR_ID } from '../constants/config'

const TOOLBARS = {
  [ROOT_DIR_ID]: FilesToolbar,
  [TRASH_DIR_ID]: TrashToolbar
}

const Topbar = ({ virtualRoot }) => {
  const Toolbar = TOOLBARS[virtualRoot]
  return (
    <div class={styles['fil-content-header']}>
      <Breadcrumb />
      <Toolbar />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  virtualRoot: state.view.virtualRoot
})

export default connect(mapStateToProps)(Topbar)
