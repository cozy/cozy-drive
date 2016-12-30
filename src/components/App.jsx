import styles from '../styles/app'

import React from 'react'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import Sidebar from './Sidebar'
import Topbar from './Topbar'

fetch('http://cozy.local:8080/files/io.cozy.files.root-dir', {
  method: 'GET',
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/vnd.api+json',
    'Content-Type': 'application/vnd.api+json'
  }
}).then(resp => resp.text()).then(body => console.log(JSON.parse(body)))

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
