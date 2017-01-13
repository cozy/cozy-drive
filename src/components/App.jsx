import styles from '../styles/app'

import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import Alerter from './Alerter'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const reload = () => {
  window.location.reload()
}

const App = ({ t, error, children }) => (
  <div class={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
    { error && <Alerter
      error={error}
      reload={reload}
      />
    }

    <Sidebar />

    <main class={styles['fil-content']}>
      <Topbar />
      { children }
    </main>
  </div>
)

const mapStateToProps = (state) => ({
  error: state.ui.error
})

const mapDispatchToProps = (dispatch) => ({})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(App))
