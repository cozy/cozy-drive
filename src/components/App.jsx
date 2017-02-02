import styles from '../styles/app'

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { translate } from '../lib/I18n'
import classNames from 'classnames'

import { openFolder } from '../actions'

import Alerter from './Alerter'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const reload = () => {
  window.location.reload()
}

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

  render ({ t, error, children }) {
    return (
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
  }
}

const mapStateToProps = (state) => ({
  folder: state.folder
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
