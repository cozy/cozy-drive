import styles from '../styles/topbar'

import React from 'react'
import { connect } from 'react-redux'

import FilesToolbar from '../containers/FilesToolbar'
import TrashToolbar from '../containers/TrashToolbar'
import Breadcrumb from '../containers/Breadcrumb'

import { FILES_CONTEXT, TRASH_CONTEXT } from '../constants/config'

const TOOLBARS = {
  [FILES_CONTEXT]: FilesToolbar,
  [TRASH_CONTEXT]: TrashToolbar
}

const Topbar = ({ context }) => {
  const Toolbar = TOOLBARS[context]
  return (
    <div class={styles['fil-content-header']}>
      <Breadcrumb />
      <Toolbar />
    </div>
  )
}

const mapStateToProps = (state, ownProps) => ({
  context: state.context
})

export default connect(mapStateToProps)(Topbar)
