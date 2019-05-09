/* global cozy */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Proptypes from 'prop-types'
import { MobileRouter } from 'cozy-authentication'
import { withClient } from 'cozy-client'
import AppRoute from 'drive/web/modules/navigation/AppRoute'
import { setToken } from 'drive/mobile/modules/authorization/duck'
import { setUrl } from 'drive/mobile/modules/settings/duck'
import { restoreCozyClientJs, initBar } from 'drive/mobile/lib/cozy-helper'
import { IconSprite } from 'cozy-ui/transpiled/react/'
import {
  unlink,
  isAuthorized,
  isRevoked,
  getOnboardingInformations
} from './duck/index'
import { saveCredentials } from './sagas'
import { setCozyUrl } from 'drive/lib/reporter'
import { getUniversalLinkDomain } from 'cozy-ui/transpiled/react/AppLinker'

class DriveMobileRouter extends Component {
  static contextTypes = {
    client: Proptypes.object.isRequired
  }

  afterAuthentication = async (/* { url, clientInfo, token, router } */) => {
    const cozyClient = this.props.client
    const url = cozyClient.stackClient.uri
    console.log('cozyClient', cozyClient)
    const clientInfo = cozyClient.getStackClient().oauthOptions
    //const wasRevoked = this.props.isRevoked
    //this.context.client.options.uri = url
    //const accesstoken = new cozy.client.auth.AccessToken(token)
    const accesstoken = cozyClient.getStackClient().token
    restoreCozyClientJs(url, clientInfo, accesstoken)
    await initBar(cozyClient)

    this.props.saveServerUrl(url)
    setCozyUrl(url)
    //this.props.saveCredentials(clientInfo, accesstoken)
    /* const oauthClient = this.context.client.getStackClient()
    oauthClient.setCredentials(token)
    oauthClient.setUri(url) */
    /* oauthClient.onTokenRefresh = () => {
      restoreCozyClientJs(url, clientInfo, token)
      this.props.dispatch(setToken(token))
    } */

    /* if (wasRevoked) {
      await initBar(this.context.client)
      router.replace('/')
    } else {
      router.replace('/onboarding')
    } */
  }

  afterLogout = () => {
    this.props.unlink(this.context.client)
  }

  render() {
    const {
      isAuthenticated,
      isRevoked,
      appRoutes,
      history,
      onboarding,
      onboardingInformations
    } = this.props
    return (
      <div style={{ flex: '1' }}>
        <MobileRouter
          /* isAuthenticated={isAuthenticated}
          isRevoked={isRevoked}
          appRoutes={appRoutes}
          history={history}
          onAuthenticated={this.afterAuthentication}
          onLogout={this.afterLogout}
          allowRegistration={false}
          onboarding={onboarding}
          onboardingInformations={onboardingInformations}
          client={this.context.client} */

          protocol={'cozydrive://'}
          history={history}
          appIcon={require('../../../../../src/drive/targets/vendor/assets/apple-touch-icon-180x180.png')}
          appTitle={'Cozy Drive'}
          appSlug={'drive'}
          universalLinkDomain={getUniversalLinkDomain()}
          appRoutes={appRoutes}
          onAuthenticated={this.afterAuthentication}
          //loginPath="/onboarding"
        />
        <IconSprite />
      </div>
    )
  }
}
DriveMobileRouter.propTypes = {
  /* onboarding: onboardingPropTypes.isRequired,
  isAuthenticated: Proptypes.bool.isRequired,
  isRevoked: Proptypes.bool.isRequired,
  appRoutes: Proptypes.object.isRequired,
  history: Proptypes.object.isRequired,
  onboardingInformations: onboardingInformationsPropTypes.isRequired */
}
const DriveMobileRouterWithRoutes = props => (
  <DriveMobileRouter {...props} appRoutes={AppRoute} />
)

const mapStateToProps = state => ({
  isAuthenticated: isAuthorized(state),
  isRevoked: isRevoked(state),
  onboardingInformations: getOnboardingInformations(state)
})

const mapDispatchToProps = dispatch => ({
  saveServerUrl: url => dispatch(setUrl(url)),
  saveCredentials: (clientInfo, token) =>
    dispatch(saveCredentials(clientInfo, token)),
  unlink: client => dispatch(unlink(client))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withClient(DriveMobileRouterWithRoutes))
