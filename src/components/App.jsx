import styles from '../styles/app'

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import { openFolder } from '../actions'

import Alerter from 'cozy-ui/react/Alerter'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Toast from '../containers/Toast'

class App extends Component {
  componentWillMount () {
    this.props.onMount()
  }

  componentWillReceiveProps (newProps) {
    if (this.props.params.file !== undefined && // we're not in the root dir
      newProps.params.file !== this.props.params.file && // the route has changed
      newProps.params.file !== newProps.folder.id) { // but the folder has not been fetched
      this.props.onRouteChange(newProps.params.file)
    }
  }

  render ({ t, notification, children, toastMessage }) {
    return (
      <div class={classNames(styles['fil-wrapper'], styles['coz-sticky'])}>
        { notification && <Alerter
          type={notification.type || 'info'}
          message={t(notification.message, notification.messageData)}
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
  folder: state.folder,
  toastMessage: state.ui.toastMessage,
  notification: state.ui.notification
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onMount: () => {
    dispatch(openFolder(ownProps.params.file, true))
  },
  onRouteChange: (folderId) => {
    dispatch(openFolder(folderId, true))
  }
})

export default translate()(connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(App)))
