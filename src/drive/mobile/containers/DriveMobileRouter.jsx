import React, { Component } from 'react'
import { connect } from 'react-redux'

import AppRoute from 'drive/components/AppRoute'
import MobileRouter from 'authentication/MobileRouter'

import { setUrl, saveCredentials } from '../actions/settings'
import { unlink } from '../actions/unlink'

class DriveMobileRouter extends Component {
  afterAuthentication = ({ url, clientInfo, token, router }) => {
    const wasRevoked = this.props.isRevoked
    this.props.saveServerUrl(url)
    this.props.saveCredentials(clientInfo, token)
    if (wasRevoked) router.replace('/')
    else router.replace('/onboarding')
  }

  afterLogout = () => {
    this.props.unlink()
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
  unlink: () => dispatch(unlink())
})

export default connect(mapStateToProps, mapDispatchToProps)(
  DriveMobileRouterWithRoutes
)
