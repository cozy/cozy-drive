/* global localStorage */

import styles from './pushClient'

import { translate } from 'cozy-ui/react/I18n'

import React, { Component } from 'react'

import classNames from 'classnames'

class BannerClient extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seen: JSON.parse(localStorage.getItem('app_ad')) || false
    }
  }

  read () {
    localStorage.setItem('app_ad', JSON.stringify(true))
    this.setState({seen: true})
  }

  render ({ t }, { seen }) {
    if (seen) return null

    return (
      <div className={styles['coz-banner-client']}>
        <a href={t('Nav.link-client')} target='_blank' className={styles['coz-btn-clientMobile']} onClick={e => this.read(e)} ><span>{t('Nav.btn-client-mobile')}</span></a>
        <p className={styles['coz-banner-text']}>
          <span>{t('Nav.banner-txt-client')}</span>
          <a href={t('Nav.link-client')} target='_blank' className={classNames('coz-btn', 'coz-btn--transparent')} onClick={e => this.read(e)}>{t('Nav.banner-btn-client')}</a>
        </p>
        <button className={classNames('coz-btn', styles['coz-btn--close'])} onClick={e => this.read()} />
      </div>
    )
  }
}

export default translate()(BannerClient)
