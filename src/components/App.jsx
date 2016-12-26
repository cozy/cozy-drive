import styles from '../styles/app'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'

import Sidebar from './Sidebar'
import Topbar from './Topbar'

const App = ({ t, children }) => (
  <div class={styles['fil-wrapper']}>

    <Sidebar />

    <main class={styles['fil-content']}>
      <Topbar />
      { children }
    </main>
  </div>
)

export default translate()(App)
