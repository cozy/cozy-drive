import React, { Component } from 'react'
import { Router, withRouter } from 'react-router'
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
    currentLocation.query.state /* &&
    currentLocation.query.cozy_url  */
  ) {
    return true
  } else {
    return false
  }
}
class MobileRouter extends Component {
  componentWillMount() {
    console.log('will mount')
    console.log('this props mobile router', this.props)
  }
  componentWillReceiveProps(nextProps) {
    console.log({ nextProps })
  }
  async fetchAccessToken() {
    //const request = ;
  }

  async checkState(receivedState, code, cozy_url, history) {
    const stateInDB = await readState()
    console.log({ stateInDB })

    const storedSecret = await readSecret()
    const clientInfo = await secretExchange(
      storedSecret,
      cozy_url,
      this.props.client
    )
    console.log({ clientInfo })
    try {
      const getToken = await getAccessToken(
        clientInfo,
        cozy_url,
        code,
        this.props.client
      )
      console.log('getToken', getToken)
      const token = await getToken.json()
      console.log({ token })
      return this.props.onAuthenticated({
        url: `https://${cozy_url}`,
        token,
        clientInfo,
        router: history
      })

      //  history.push('auth?token=""&access_code')
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
    console.log('history', history)

    console.log('isAuthenticated', isAuthenticated)
    // alert('history')
    if (!isAuthenticated) {
      const currentLocation = history.getCurrentLocation()
      //dispatch
      if (checkIfOnboardingLogin(currentLocation)) {
        const {
          /* access_code, */ code,
          state,
          cozy_url
        } = currentLocation.query
        this.checkState(state, code, cozy_url, history)
        //test,
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
