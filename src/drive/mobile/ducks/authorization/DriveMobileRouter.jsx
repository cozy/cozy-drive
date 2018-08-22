import React, { Component } from 'react'
import { connect } from 'react-redux'

import AppRoute from 'drive/components/AppRoute'
import MobileRouter from 'authentication/MobileRouter'

import { saveCredentials, unlink } from './actions'
import { isAuthorized, isRevoked } from './reducers'
import { setUrl } from '../settings'
import { restoreCozyClientJs, initBar } from 'drive/mobile/lib/cozy-helper'

class DriveMobileRouter extends Component {
  afterAuthentication = async ({ url, clientInfo, token, router }) => {
    const wasRevoked = this.props.isRevoked
    this.context.client.options.uri = url
    await restoreCozyClientJs(url, clientInfo, token)
    this.props.saveServerUrl(url)
    this.props.saveCredentials(clientInfo, token)
    if (wasRevoked) {
      initBar(this.context.client)
      router.replace('/')
    } else {
      router.replace('/onboarding')
    }
  }

  afterLogout = () => {
    this.props.unlink(this.context.client)
  }

  render(props) {
    return (
      <MobileRouter
        isAuthenticated={props.isAuthenticated}
        isRevoked={props.isRevoked}
        appRoutes={props.appRoutes}
        history={props.history}
        onAuthenticated={this.afterAuthentication}
        onLogout={this.afterLogout}
        allowRegistration={false}
      />
    )
  }
}

const DriveMobileRouterWithRoutes = props => (
  <DriveMobileRouter {...props} appRoutes={AppRoute} />
)

const mapStateToProps = state => ({
  isAuthenticated: isAuthorized(state),
  isRevoked: isRevoked(state)
})

const mapDispatchToProps = dispatch => ({
  saveServerUrl: url => dispatch(setUrl(url)),
  saveCredentials: (clientInfo, token) =>
    dispatch(saveCredentials(clientInfo, token)),
  unlink: client => dispatch(unlink(client))
})

export default connect(mapStateToProps, mapDispatchToProps)(
  DriveMobileRouterWithRoutes
)
