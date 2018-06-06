import React, { Component } from 'react'
import { connect } from 'react-redux'

import AppRoute from 'drive/components/AppRoute'
import MobileRouter from 'authentication/MobileRouter'

import { setUrl, saveCredentials } from '../actions/settings'
import { unlink } from '../actions/unlink'
import { restoreCozyClientJs } from 'drive/mobile/lib/cozy-helper'

class DriveMobileRouter extends Component {
  afterAuthentication = async ({ url, clientInfo, token, router }) => {
    const wasRevoked = this.props.isRevoked
    this.props.saveServerUrl(url)
    this.props.saveCredentials(clientInfo, token)
    await restoreCozyClientJs(url, clientInfo, token)
    if (wasRevoked) {
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
        {...props}
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
  isAuthenticated: state.mobile.settings.authorized,
  isRevoked: state.mobile.authorization.revoked
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
