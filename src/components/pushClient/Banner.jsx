/* global localStorage */

import styles from './pushClient'

import { translate } from 'cozy-ui/react/I18n'

import React, { Component } from 'react'
import { track, isLinux, isAndroid, isIOS, DESKTOP_BANNER } from '.'
import { Button, ButtonLink, Icon } from 'cozy-ui/react'

import localforage from 'localforage'

class BannerClient extends Component {
  state = {
    seen: true
  }

  async componentWillMount() {
    const seen = (await localforage.getItem(DESKTOP_BANNER)) || false
    this.setState(state => ({ ...state, seen }))
  }

  markAsSeen(element) {
    localforage.setItem(DESKTOP_BANNER, true)
    this.setState(state => ({ ...state, seen: true }))
    track(element)
  }

  render() {
    const { t } = this.props
    if (this.state.seen) return null

    const mobileLink = isIOS()
      ? 'Nav.link-client-ios'
      : isAndroid() ? 'Nav.link-client-android' : 'Nav.link-client'
    const desktopLink = isLinux()
      ? 'Nav.link-client'
      : 'Nav.link-client-desktop'

    return (
      <div className={styles['coz-banner-client']}>
        <ButtonLink
          href={t(mobileLink)}
          target
          className={styles['coz-btn-clientMobile']}
          onClick={e => {
            this.markAsSeen('banner')
          }}
        >
          <span>{t('Nav.btn-client-mobile')}</span>
        </ButtonLink>
        <p className={styles['coz-banner-text']}>
          <span>{t('Nav.banner-txt-client')}</span>
          <ButtonLink
            href={t(desktopLink)}
            target
            theme="alpha"
            onClick={e => {
              this.markAsSeen('banner')
            }}
          >
            {t('Nav.banner-btn-client')}
          </ButtonLink>
        </p>
        <Button
          theme="close"
          className={styles['close-banner']}
          onClick={e => {
            this.markAsSeen('close')
          }}
        >
          <Icon icon="cross" width="24" height="24" />
        </Button>
      </div>
    )
  }
}

export default translate()(BannerClient)
