import styles from '../styles/topbar'

import React from 'react'
import { translate } from '../lib/I18n'

import Toolbar from '../containers/Toolbar'

export const Topbar = ({ t, viewName }) => {
  return <div className={styles['pho-content-header']}>
    <h2 className={styles['pho-content-title']}>
      {t(`Nav.${viewName}`)}
    </h2>
    <Toolbar />
  </div>
}

export default translate()(Topbar)
