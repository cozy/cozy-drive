import styles from '../styles/topbar'

import React from 'react'
import { withRouter } from 'react-router'

import Toolbar from '../containers/Toolbar'
import Breadcrumb from '../containers/Breadcrumb'
import PageTitle from './PageTitle'

const Topbar = ({location}) => {
  if (/^\/files/.test(location.pathname)) {
    return (
      <div class={styles['fil-content-header']}>
        <Breadcrumb />
        <Toolbar />
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
