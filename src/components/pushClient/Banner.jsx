/* global localStorage */

import styles from './pushClient.styl'

import { translate } from 'cozy-ui/react/I18n'

import React, { Component } from 'react'
import {
  track,
  isLinux,
  isAndroid,
  isIOS,
  isClientAlreadyInstalled,
  DESKTOP_BANNER
} from '.'
import { Button, ButtonLink, Icon } from 'cozy-ui/react'

import Config from '../../drive/config/config.json'
import localforage from 'localforage'

class BannerClient extends Component {
  state = {
    mustShow: false
  }

  async componentWillMount() {
    if (Config.promoteDesktop.isActivated !== true) return
    const seen = (await localforage.getItem(DESKTOP_BANNER)) || false
    if (!seen) {
      const mustSee = !(await isClientAlreadyInstalled())
      if (mustSee) {
        this.setState(state => ({ ...state, mustShow: true }))
      }
    }
  }

  markAsSeen(element) {
    localforage.setItem(DESKTOP_BANNER, true)
    this.setState(state => ({ ...state, mustShow: false }))
    track(element)
  }

  render() {
    if (Config.promoteDesktop.isActivated !== true) return null
    const { t } = this.props
    if (!this.state.mustShow) return null

    const mobileLink = isIOS()
      ? 'Nav.link-client-ios'
      : isAndroid()
        ? 'Nav.link-client-android'
        : 'Nav.link-client'
    const desktopLink = isLinux()
      ? 'Nav.link-client'
      : 'Nav.link-client-desktop'

    return (
      <div className={styles['coz-banner-client']}>
        <ButtonLink
          href={t(mobileLink)}
          target="_blank"
          className={styles['coz-btn-clientMobile']}
          onClick={() => {
            this.markAsSeen('banner')
          }}
          label={t('Nav.btn-client-mobile')}
        />
        <p className={styles['coz-banner-text']}>
          <span>{t('Nav.banner-txt-client')}</span>
          <ButtonLink
            href={t(desktopLink)}
            target="_blank"
            theme="alpha"
            onClick={() => {
              this.markAsSeen('banner')
            }}
            label={t('Nav.banner-btn-client')}
          />
        </p>
        <Button
          theme="close"
          extension="narrow"
          className={styles['close-banner']}
          onClick={() => {
            this.markAsSeen('close')
          }}
          icon={<Icon icon="cross" width="24" height="24" />}
          iconOnly
          label={t('SelectionBar.close')}
        />
      </div>
    )
  }
}

export default translate()(BannerClient)
