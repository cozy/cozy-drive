import React, { Component } from 'react'
import { withClient } from 'cozy-client'
import localforage from 'localforage'

import { translate } from 'cozy-ui/transpiled/react/providers/I18n'
import { default as UIButtonClient } from 'cozy-ui/transpiled/react/deprecated/PushClientButton'
import { isFlagshipApp } from 'cozy-device-helper'

import { isLinux, isClientAlreadyInstalled, DESKTOP_BANNER } from '.'
import Config from 'drive/config/config.json'

class ButtonClient extends Component {
  state = {
    mustShow: false
  }

  async UNSAFE_componentWillMount() {
    if (Config.promoteDesktop.isActivated !== true || isFlagshipApp()) return
    const seen = (await localforage.getItem(DESKTOP_BANNER)) || false
    // we want to show the button if the banner has been marked as seen *and*
    // the client hasn't been already installed
    if (seen) {
      const mustSee = !(await isClientAlreadyInstalled(this.props.client))
      if (mustSee) {
        this.setState(state => ({ ...state, mustShow: true }))
      }
    }
  }

  render() {
    if (
      Config.promoteDesktop.isActivated !== true ||
      !this.state.mustShow ||
      isFlagshipApp()
    )
      return null
    const { t } = this.props
    return (
      <UIButtonClient
        label={t('Nav.btn-client')}
        href={t(isLinux() ? 'Nav.link-client' : 'Nav.link-client-desktop')}
        className={'u-m-1 u-dn-m'}
      />
    )
  }
}

export default translate()(withClient(ButtonClient))
