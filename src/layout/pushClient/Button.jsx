import styles from './pushClient'

import { translate } from 'cozy-ui/react/I18n'

import React, { Component } from 'react'
import localforage from 'localforage'
import { track, DESKTOP_BANNER } from '.'

class ButtonClient extends Component {
  state = {
    seen: true
  }

  async componentWillMount () {
    const seen = await localforage.getItem(DESKTOP_BANNER) || false
    this.setState((state) => ({...state, seen}))
  }

  render () {
    const { t } = this.props
    return this.state.seen && (
      <a href={t('Nav.link-client')} target='_blank' className={styles['coz-btn-client']} onClick={(e) => { track('button') }}><span>{t('Nav.btn-client')}</span></a>
    )
  }
}

export default translate()(ButtonClient)
