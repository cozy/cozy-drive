import styles from './pushClient'

import { translate } from 'cozy-ui/react/I18n'

import React, { Component } from 'react'
import localforage from 'localforage'
import { track, isLinux, isClientAlreadyInstalled, DESKTOP_BANNER } from '.'

class ButtonClient extends Component {
  state = {
    mustShow: false
  }

  async componentWillMount() {
    const seen = (await localforage.getItem(DESKTOP_BANNER)) || false
    // we want to show the button if the banner has been marked as seen *and*
    // the client hasn't been already installed
    if (seen) {
      const mustSee = !await isClientAlreadyInstalled()
      if (mustSee) {
        this.setState(state => ({ ...state, mustShow: true }))
      }
    }
  }

  render() {
    const { t } = this.props
    return this.state.mustShow ? (
      <a
        href={t(isLinux() ? 'Nav.link-client' : 'Nav.link-client-desktop')}
        target="_blank"
        className={styles['coz-btn-client']}
        onClick={e => {
          track('button')
        }}
      >
        <span>{t('Nav.btn-client')}</span>
      </a>
    ) : null
  }
}

export default translate()(ButtonClient)
