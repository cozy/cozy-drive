import styles from '../styles/app'

import React from 'react'
import { translate } from '../plugins/preact-polyglot'

import Sidebar from './sidebar'
import Topbar from './topbar'
import Table from './table'

const App = ({ t }) => (
  <div class={styles['fil-wrapper']}>

    <Sidebar />

    <main class={styles['fil-content']}>
      <Topbar />
      <Table />
    </main>
  </div>
)

export default translate()(App)
