// eslint-disable-next-line no-redeclare,no-unused-vars
/* global localStorage */

import localforage from 'localforage'
import flow from 'lodash/flow'
import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import Banner from 'cozy-ui/transpiled/react/Banner'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DeviceLaptopIcon from 'cozy-ui/transpiled/react/Icons/DeviceLaptop'
import DevicePhoneIcon from 'cozy-ui/transpiled/react/Icons/DevicePhone'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import {
  isLinux,
  isAndroid,
  isIOS,
  isClientAlreadyInstalled,
  DESKTOP_BANNER
} from '.'
import styles from './pushClient.styl'
import Config from 'config/config.json'

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

    const isMobile = isIOS() || isAndroid()
    const text = isMobile ? 'Nav.btn-client-mobile' : 'Nav.banner-txt-client'

    return (
      <div className={styles['coz-banner-client']}>
        <Banner
          inline
          icon={
            <Icon
              icon={isMobile ? DevicePhoneIcon : DeviceLaptopIcon}
              size="100%"
            />
          }
          text={t(text)}
          bgcolor="var(--contrastBackgroundColor)"
          buttonOne={
            <Button
              component="a"
              variant="text"
              label={t('Nav.banner-btn-client')}
              onClick={() => this.markAsSeen('banner')}
              startIcon={<Icon icon={DownloadIcon} />}
              href={t(link)}
            />
          }
          buttonTwo={
            <Button
              variant="text"
              label={t('SelectionBar.close')}
              onClick={() => this.markAsSeen('close')}
            />
          }
        />
      </div>
    )
  }
}

export default flow(translate(), withClient)(BannerClient)
