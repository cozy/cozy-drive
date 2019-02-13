import React, { Component } from 'react'
import { Router, withRouter, Route } from 'react-router'
import Proptypes from 'prop-types'
import Authentication from './src/Authentication'
import Revoked from './src/Revoked'
import { logException } from 'drive/lib/reporter'
import { readSecret } from './src/utils/onboarding'
import {
  readState,
  secretExchange,
  getAccessToken
} from './src/utils/onboarding'
const checkIfOnboardingLogin = currentLocation => {
  if (
    currentLocation.pathname === '/auth' &&
    currentLocation.query.access_code &&
    currentLocation.query.code &&
    currentLocation.query.state &&
    currentLocation.query.cozy_url
  ) {
    return true
  } else {
    return false
  }
}
class MobileRouter extends Component {
  async checkState(receivedState, code, cozy_url, history) {
    const stateInDB = await readState()

    const storedSecret = await readSecret()
    const clientInfo = await secretExchange(
      storedSecret,
      cozy_url,
      this.props.client
    )
    try {
      const getToken = await getAccessToken(
        clientInfo,
        cozy_url,
        code,
        this.props.client
      )
      const token = await getToken.json()
      return this.props.onAuthenticated({
        url: `https://${cozy_url}`,
        token,
        clientInfo,
        router: history
      })
    } catch (e) {
      console.log('errror', e)
    }

    if (stateInDB === receivedState) {
      return true
    }
    return false
  }
  render() {
    const {
      history,
      appRoutes,
      isAuthenticated,
      isRevoked,
      onAuthenticated,
      onLogout,
      appIcon,
      onboarding
      /* client */
    } = this.props

    if (!isAuthenticated) {
      const currentLocation = history.getCurrentLocation()
      if (checkIfOnboardingLogin(currentLocation)) {
        const { code, state, cozy_url } = currentLocation.query
        this.checkState(state, code, cozy_url, history)
      } else {
        return (
          <Authentication
            router={history}
            onComplete={onAuthenticated}
            onException={logException}
            appIcon={appIcon}
            onboarding={onboarding}
          />
        )
      }
    } else if (isRevoked) {
      return (
        <Revoked
          router={history}
          onLogBackIn={onAuthenticated}
          onLogout={onLogout}
        />
      )
    } else {
      return <Router history={history}>{appRoutes}</Router>
    }
  }
}

MobileRouter.propTypes = {
  onboarding: Proptypes.object
}
export default withRouter(MobileRouter)
