import React, { Component } from 'react'
import { connect } from 'react-redux'
import Proptypes from 'prop-types'
import localForage from 'localforage'
import { MobileRouter } from 'cozy-authentication'
import { getUniversalLinkDomain } from 'cozy-ui/transpiled/react/AppLinker'
import { withClient } from 'cozy-client'
import AppRoute from 'drive/web/modules/navigation/AppRoute'
import { setToken } from 'drive/mobile/modules/authorization/duck'
import { setUrl } from 'drive/mobile/modules/settings/duck'
import { restoreCozyClientJs, initBar } from 'drive/mobile/lib/cozy-helper'
import { IconSprite } from 'cozy-ui/transpiled/react/'

import { unlink } from './duck/index'
import { saveCredentials } from './sagas'
import { setCozyUrl } from 'drive/lib/reporter'
import { ONBOARDED_ITEM } from 'drive/mobile/modules/onboarding/OnBoarding'
import { PROTOCOL, SOFTWARE_NAME } from 'drive/mobile/lib/constants'
import appMetadata from 'drive/appMetadata'

import appBooted from '../../../targets/mobile/'
class DriveMobileRouter extends Component {
  async componentDidMount() {
    //Wait for the app to be booted to avoid race condition between cordova & JS
    await appBooted
  }
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
    oauthClient.onTokenRefresh = async token => {
      restoreCozyClientJs(
        client.getStackClient().uri,
        client.getStackClient().oauthOptions,
        token
      )
      this.props.dispatch(setToken(token))
      await initBar(client)
    }
    //Check if we have something in the localStorage to see if
    //we need to redirect to /onboarding
    const alreadyOnboarded = await localForage.getItem(ONBOARDED_ITEM)
    //Do not try to add an else case since we can arrive from an universal
    //link and then, we need to redirect to a specific url
    if (!alreadyOnboarded) {
      this.props.history.replace('/onboarding')
    }
  }

  afterLogout = () => {
    this.props.unlink(this.props.client)
    this.props.history.replace('/')
  }

  render() {
    const { history } = this.props
    return (
      <div style={{ flex: '1' }}>
        <MobileRouter
          protocol={PROTOCOL}
          appTitle={SOFTWARE_NAME}
          universalLinkDomain={getUniversalLinkDomain()}
          appSlug={appMetadata.slug}
          history={history}
          onAuthenticated={async () => {
            return await this.afterAuthentication()
          }}
          loginPath={false}
          onLogout={this.afterLogout}
          appIcon={require('../../../../../src/drive/targets/vendor/assets/apple-touch-icon-180x180.png')}
        >
          {AppRoute}
        </MobileRouter>
        <IconSprite />
      </div>
    )
  }
}
DriveMobileRouter.propTypes = {
  history: Proptypes.object.isRequired
}

const mapDispatchToProps = dispatch => ({
  saveServerUrl: url => dispatch(setUrl(url)),
  saveCredentials: (clientInfo, token) =>
    dispatch(saveCredentials(clientInfo, token)),
  unlink: client => dispatch(unlink(client))
})

export default connect(
  null,
  mapDispatchToProps
)(withClient(DriveMobileRouter))
