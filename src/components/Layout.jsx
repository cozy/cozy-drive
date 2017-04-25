import styles from '../styles/layout'

import React from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import Sidebar from './Sidebar'
import Alerter from './Alerter'

export const Layout = ({ t, children }) => (
  <div className={classNames(styles['pho-wrapper'], styles['coz-sticky'])}>
    <Sidebar />

    <main className={styles['pho-content']}>
      { children }
    </main>
    <Alerter t={t} />
  </div>
)

export default translate()(Layout)
