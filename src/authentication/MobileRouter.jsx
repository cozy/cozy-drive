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
  async doOnboardingLogin(receivedState, code, cozy_url, history) {
    const localState = await readState()
    const localSecret = await readSecret()

    try {
      if (localState !== receivedState) {
        throw new Error('States are not equals')
      }

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
        throw new Error('exchanged informations are not good')

      const getTokenRequest = await getAccessToken(
        clientInfo,
        cozy_url,
        code,
        this.props.client
      )
      const token = await getTokenRequest.json()
      if (getTokenRequest.status !== 200) {
        throw new Error('token.error')
      }

      await this.props.onAuthenticated({
        url: `https://${cozy_url}`,
        token,
        clientInfo,
        router: history
      })
    } catch (error) {
      this.props.onLogout()
    } finally {
      clearState()
      clearSecret()
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
        /* We need to hide() the ViewController since the ViewController is still active 
        when the application cames from background (specialy on iOS)
        */
        window.SafariViewController.hide()
        const { code, state, cozy_url } = onboardingInformations
        this.doOnboardingLogin(state, code, cozy_url, history)
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
