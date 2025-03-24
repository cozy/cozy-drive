// eslint-disable-next-line no-redeclare,no-unused-vars
/* global localStorage */

import localforage from 'localforage'
import flow from 'lodash/flow'
import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import Banner from 'cozy-ui/transpiled/react/Banner'
import Button from 'cozy-ui/transpiled/react/Buttons'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DesktopDownloadIcon from 'cozy-ui/transpiled/react/Icons/DesktopDownload'
import DeviceLaptopIcon from 'cozy-ui/transpiled/react/Icons/DeviceLaptop'
import DevicePhoneIcon from 'cozy-ui/transpiled/react/Icons/DevicePhone'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import PhoneDownloadIcon from 'cozy-ui/transpiled/react/Icons/PhoneDownload'
import { isTwakeTheme } from 'cozy-ui/transpiled/react/helpers/isTwakeTheme'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import {
  isLinux,
  isAndroid,
  isIOS,
  isClientAlreadyInstalled,
  DESKTOP_BANNER
} from '.'

import Config from '@/config/config.json'

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
      <div className="u-pos-relative">
        <Banner
          inline
          disableIconStyles={isTwakeTheme()}
          icon={
            <Icon
              className={isTwakeTheme() ? 'u-mt-1 u-ml-1' : ''}
              icon={
                isTwakeTheme()
                  ? isMobile
                    ? PhoneDownloadIcon
                    : DesktopDownloadIcon
                  : isMobile
                  ? DevicePhoneIcon
                  : DeviceLaptopIcon
              }
              color={
                isTwakeTheme()
                  ? 'var(--primaryTextColor)'
                  : 'var(--iconTextColor)'
              }
              size={isTwakeTheme() ? (isMobile ? 24 : 20) : '100%'}
            />
          }
          text={t(text, {
            name: isTwakeTheme()
              ? 'Twake Drive'
              : isMobile
              ? 'Cozy'
              : 'Cozy Drive'
          })}
          bgcolor={
            isTwakeTheme()
              ? 'var(--defaultBackgroundColor)'
              : 'var(--contrastBackgroundColor)'
          }
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
          noDivider={isTwakeTheme()}
        />
      </div>
    )
  }
}

export default flow(translate(), withClient)(BannerClient)
