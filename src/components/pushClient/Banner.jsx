/* global localStorage */

import styles from './pushClient.styl'

import { translate } from 'cozy-ui/transpiled/react/I18n'

import React, { Component } from 'react'
import {
  track,
  isLinux,
  isAndroid,
  isIOS,
  isClientAlreadyInstalled,
  DESKTOP_BANNER
} from '.'
import { Button, ButtonLink, Icon } from 'cozy-ui/transpiled/react'
import { withClient } from 'cozy-client'
import Config from 'drive/config/config.json'
import localforage from 'localforage'

class BannerClient extends Component {
  state = {
    mustShow: false
  }
  constructor(props) {
    super(props)
    this.willUnmount = false
  }

  async componentDidMount() {
    this.willUnmount = false
    const seen = (await localforage.getItem(DESKTOP_BANNER)) || false
    if (!seen) {
      const mustSee = !(await isClientAlreadyInstalled(this.props.client))
      if (mustSee && !this.willUnmount) {
        this.setState({ mustShow: true })
      }
    }
  }
  componentWillUnmount() {
    this.willUnmount = true
  }

  markAsSeen(element) {
    localforage.setItem(DESKTOP_BANNER, true)
    this.setState({ mustShow: false })
    track(element)
  }

  render() {
    if (Config.promoteDesktop.isActivated !== true || !this.state.mustShow)
      return null
    const { t } = this.props

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
        <div className={styles['coz-banner-text']}>
          <figure>
            <Icon icon="cozy" width="44" height="44" />
          </figure>
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
        </div>
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

export default translate()(withClient(BannerClient))
