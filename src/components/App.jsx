import styles from '../styles/app'

import React from 'react'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import Sidebar from './Sidebar'
import Alerter from './Alerter'

export const App = ({ t, children }) => (
  <div className={classNames(styles['pho-wrapper'], styles['coz-sticky'])}>

    <Sidebar />

    <main className={styles['pho-content']}>
      { children }
    </main>
    <Alerter t={t} />
  </div>
)

export default translate()(App)
