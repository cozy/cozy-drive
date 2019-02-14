import React, { Component } from 'react'
import { Router, withRouter } from 'react-router'
import Proptypes from 'prop-types'
import Authentication from './src/Authentication'
import Revoked from './src/Revoked'
import { logException } from 'drive/lib/reporter'
import {
  readState,
  secretExchange,
  getAccessToken,
  readSecret,
  clearSecret,
  clearState,
  checkExchangedInformations,
  checkIfOnboardingLogin
} from './src/utils/onboarding'

class MobileRouter extends Component {
  async checkState(receivedState, code, cozy_url, history) {
    const localState = await readState()
    const localSecret = await readSecret()
    try {
      const clientInfo = await secretExchange(
        localSecret,
        cozy_url,
        this.props.client
      )

      const { onboarding_secret, onboarding_state } = clientInfo

      if (
        !checkExchangedInformations(
          localSecret,
          onboarding_secret,
          localState,
          onboarding_state
        )
      )
        throw new Error('ERROR', 'exchanged informations are not good')

      const getTokenRequest = await getAccessToken(
        clientInfo,
        cozy_url,
        code,
        this.props.client
      )
      const token = await getTokenRequest.json()
      if (getTokenRequest.status !== 200) {
        throw new Error('ERROR', token.error)
      }

      const afterAuth = await this.props.onAuthenticated({
        url: `https://${cozy_url}`,
        token,
        clientInfo,
        router: history
      })
      console.log('afterAuth', afterAuth)
      clearState()
      clearSecret()
    } catch (error) {
      console.log('error', error)
      this.props.onLogout()
      return false
    }
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
      onboarding,
      onboardingInformations
    } = this.props

    if (!isAuthenticated) {
      if (checkIfOnboardingLogin(onboardingInformations)) {
        window.SafariViewController.hide()
        const { code, state, cozy_url } = onboardingInformations
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
  onboarding: Proptypes.object,
  onboardingInformations: Proptypes.object
}
export default withRouter(MobileRouter)
