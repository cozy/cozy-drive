// eslint-disable-next-line no-redeclare,no-unused-vars
/* global localStorage */

import React, { Component } from 'react'
import localforage from 'localforage'
import flow from 'lodash/flow'

import { withClient } from 'cozy-client'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Banner from 'cozy-ui/transpiled/react/Banner'
import Button, { ButtonLink } from 'cozy-ui/transpiled/react/Button'
import Icon from 'cozy-ui/transpiled/react/Icon'
import palette from 'cozy-ui/transpiled/react/palette'
import DeviceLaptopIcon from 'cozy-ui/transpiled/react/Icons/DeviceLaptop'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'

import {
  isLinux,
  isAndroid,
  isIOS,
  isClientAlreadyInstalled,
  DESKTOP_BANNER
} from '.'
import Config from 'drive/config/config.json'
import styles from './pushClient.styl'

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

  markAsSeen() {
    localforage.setItem(DESKTOP_BANNER, true)
    this.setState({ mustShow: false })
  }

  render() {
    if (Config.promoteDesktop.isActivated !== true || !this.state.mustShow)
      return null

    const { t } = this.props

    const link = isIOS()
      ? 'Nav.link-client-ios'
      : isAndroid()
      ? 'Nav.link-client-android'
      : isLinux()
      ? 'Nav.link-client'
      : 'Nav.link-client-desktop'

    const text =
      isIOS() || isAndroid() ? 'Nav.btn-client-mobile' : 'Nav.banner-txt-client'

    return (
      <div className={styles['coz-banner-client']}>
        <Banner
          inline
          icon={<Icon icon={DeviceLaptopIcon} size="100%" />}
          text={t(text)}
          bgcolor={palette['paleGrey']}
          buttonOne={
            <ButtonLink
              href={t(link)}
              theme="text"
              icon={DownloadIcon}
              label={t('Nav.banner-btn-client')}
              onClick={() => this.markAsSeen('banner')}
            />
          }
          buttonTwo={
            <Button
              theme="text"
              label={t('SelectionBar.close')}
              onClick={() => {
                this.markAsSeen('close')
              }}
            />
          }
        />
      </div>
    )
  }
}

export default flow(translate(), withClient)(BannerClient)
