import styles from '../styles/topbar'

import React from 'react'
import { withRouter } from 'react-router'

import FilesToolbar from '../containers/FilesToolbar'
import TrashToolbar from '../containers/TrashToolbar'
import Breadcrumb from '../containers/Breadcrumb'
import PageTitle from './PageTitle'

const Topbar = ({location}) => {
  const isFiles = /^\/files/.test(location.pathname)
  const isTrash = /^\/trash/.test(location.pathname)

  if (isFiles || isTrash) {
    return (
      <div class={styles['fil-content-header']}>
        <Breadcrumb />
        { isFiles && <FilesToolbar /> }
        { isTrash && <TrashToolbar /> }
      </div>
    )
  }
  return (
    <div class={styles['fil-content-header']}>
      <PageTitle pathname={location.pathname} />
    </div>
  )
}

export default withRouter(Topbar)
