import styles from './pushClient.styl'

import { translate } from 'cozy-ui/transpiled/react/I18n'

import React, { Component } from 'react'
import { withClient } from 'cozy-client'
import localforage from 'localforage'
import { track, isLinux, isClientAlreadyInstalled, DESKTOP_BANNER } from '.'
import Config from 'drive/config/config.json'

import { Icon } from 'cozy-ui/transpiled/react'
//@TODO Use PushClient button from cozy-ui
import DeviceIcon from 'cozy-ui/assets/icons/illus/device-laptop.svg'

class ButtonClient extends Component {
  state = {
    mustShow: false
  }

  async componentWillMount() {
    if (Config.promoteDesktop.isActivated !== true) return
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
    if (Config.promoteDesktop.isActivated !== true || !this.state.mustShow)
      return null
    const { t } = this.props
    return (
      <a
        href={t(isLinux() ? 'Nav.link-client' : 'Nav.link-client-desktop')}
        //eslint-disable-next-line react/jsx-no-target-blank
        target="_blank"
        className={styles['coz-btn-client']}
        onClick={() => {
          track('button')
        }}
      >
        <figure>
          <Icon width="32" height="32" icon={DeviceIcon} />
        </figure>
        <span>{t('Nav.btn-client')}</span>
      </a>
    )
  }
}

export default translate()(withClient(ButtonClient))
