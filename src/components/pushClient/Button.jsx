import styles from './pushClient'

import { translate } from 'cozy-ui/react/I18n'

import React, { Component } from 'react'
import localforage from 'localforage'
import { track, isLinux, DESKTOP_BANNER } from '.'

class ButtonClient extends Component {
  state = {
    seen: false
  }

  async componentWillMount() {
    const seen = (await localforage.getItem(DESKTOP_BANNER)) || false
    this.setState(state => ({ ...state, seen }))
  }

  render() {
    const { t } = this.props
    // show the button if the banner has been marked as seen
    return this.state.seen ? (
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
