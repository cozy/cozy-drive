import styles from '../styles/app'

import React from 'react'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import Sidebar from './Sidebar'
import Topbar from './Topbar'

const App = ({ t, children }) => (
  <div class={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>

    <Sidebar />

    <main class={styles['fil-content']}>
      <Topbar />
      { children }
    </main>
  </div>
)

export default translate()(App)
