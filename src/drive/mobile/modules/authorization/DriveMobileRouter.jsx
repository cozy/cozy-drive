/* global cozy */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Proptypes from 'prop-types'
import localForage from 'localforage'
//import MobileRouter from 'authentication/MobileRouter'
import { MobileRouter } from 'cozy-authentication'
import { getUniversalLinkDomain } from 'cozy-ui/transpiled/react/AppLinker'
import { withClient } from 'cozy-client'
import AppRoute from 'drive/web/modules/navigation/AppRoute'
import { setToken } from 'drive/mobile/modules/authorization/duck'
import { setUrl } from 'drive/mobile/modules/settings/duck'
import { restoreCozyClientJs, initBar } from 'drive/mobile/lib/cozy-helper'
import { IconSprite } from 'cozy-ui/transpiled/react/'
import { startReplication } from 'drive/mobile/modules/replication/sagas'

import {
  unlink,
  isAuthorized,
  isRevoked,
  getOnboardingInformations
} from './duck/index'
import { saveCredentials } from './sagas'
import { setCozyUrl } from 'drive/lib/reporter'
import { ONBOARDED_ITEM } from 'drive/mobile/modules/onboarding/OnBoarding'
class DriveMobileRouter extends Component {
  afterAuthentication = async () => {
    const { client } = this.props
    const accesstoken = client.getStackClient().token
    restoreCozyClientJs(
      client.getStackClient().uri,
      client.getStackClient().oauthOptions,
      client.getStackClient().token
    )
    await initBar(client)
    this.props.saveServerUrl(client.getStackClient().uri)
    setCozyUrl(client.getStackClient().uri)
    this.props.saveCredentials(client, accesstoken)
    const oauthClient = client.getStackClient()
    oauthClient.onTokenRefresh = token => {
      restoreCozyClientJs(
        client.getStackClient().uri,
        client.getStackClient().oauthOptions,
        token
      )
      this.props.dispatch(setToken(token))
    }
    //Check if we have something in the localStorage to see if
    //we need to redirect to /onboarding
    const alreadyOnboarded = await localForage.getItem(ONBOARDED_ITEM)
    if (!alreadyOnboarded) {
      this.props.history.replace('/onboarding')
    } else {
      this.props.history.replace('/')
    }
  }

  afterLogout = () => {
    this.props.unlink(this.props.client)
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
        {/*
         <MobileRouter
              history={hashHistory}
              protocol="cozyexample://"
              universalLinkDomain={getUniversalLinkDomain()}
              appTitle={title}
              appIcon={icon}
              appSlug="example"
              loginPath={window.location.hash.replace('#', '')}
            >
        */}
        <MobileRouter
          //appRoutes={appRoutes}
          protocol="cozydrive://"
          appTitle={'Cozy Drive'}
          universalLinkDomain={getUniversalLinkDomain()}
          appSlug="drive"
          /**
           * it can't be /onboarding since we pass everytime in
           * this loginpath="" after just a refresh or after a
           * real login
           */
          history={history}
          onAuthenticated={async () => {
            console.log('passe dans onAuthenticated ')
            return await this.afterAuthentication()
          }}
          loginPath={false}
          onLogout={this.afterLogout}
          appIcon={require('../../../../../src/drive/targets/vendor/assets/apple-touch-icon-180x180.png')}
        >
          {appRoutes}
        </MobileRouter>
        <IconSprite />
      </div>
    )
  }
}
DriveMobileRouter.propTypes = {
  isAuthenticated: Proptypes.bool.isRequired,
  isRevoked: Proptypes.bool.isRequired,
  appRoutes: Proptypes.object.isRequired,
  history: Proptypes.object.isRequired
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
