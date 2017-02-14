import styles from '../styles/app'

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import { openFolder, alertClosed } from '../actions'

import Alerter from 'cozy-ui/react/Alerter'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Toast from '../containers/Toast'

class App extends Component {
  render ({ t, alert, children, toastMessage }) {
    return (
      <div class={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
        { alert && <Alerter
          type={alert.type || 'info'}
          message={t(alert.message, alert.messageData)}
          onClose={this.props.onAlertAutoClose}
          />
        }
        <Sidebar />

        <main class={styles['fil-content']}>
          <Topbar />
          { children }
          { toastMessage && <Toast />}
        </main>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  folderId: state.ui.currentFolderId,
  toastMessage: state.ui.toastMessage,
  alert: state.ui.alert
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAlertAutoClose: () => {
    dispatch(alertClosed())
  }
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(App)))
