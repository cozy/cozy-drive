import localforage from 'localforage'
import React, { Component } from 'react'

import { withClient } from 'cozy-client'
import { isFlagshipApp } from 'cozy-device-helper'
import Icon from 'cozy-ui/transpiled/react/Icon'
import DriveIcon from 'cozy-ui/transpiled/react/Icons/Drive'
import ListItem from 'cozy-ui/transpiled/react/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import Paper from 'cozy-ui/transpiled/react/Paper'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import {
  getDesktopAppDownloadLink,
  isClientAlreadyInstalled,
  DESKTOP_BANNER
} from '@/components/pushClient'
import Config from '@/config/config.json'

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

    const link = getDesktopAppDownloadLink({ t })

    return (
      <Paper
        elevation={10}
        className="u-mh-1-half u-mb-1-half u-c-pointer"
        style={{ backgroundColor: 'var(--defaultBackgroundColor)' }}
        onClick={() => window.open(link)}
      >
        <ListItem component="div">
          <ListItemIcon>
            <Icon icon={DriveIcon} size={32} />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{
              variant: 'overline',
              color: 'textPrimary'
            }}
            primary="Twake Drive App"
            secondaryTypographyProps={{
              variant: 'overline',
              color: 'primary'
            }}
            secondary={t('Nav.banner-btn-client')}
          />
        </ListItem>
      </Paper>
    )
  }
}

export default translate()(withClient(ButtonClient))
