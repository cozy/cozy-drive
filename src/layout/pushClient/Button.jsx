import styles from './pushClient'

import { translate } from 'cozy-ui/react/I18n'

import React, { Component } from 'react'

class ButtonClient extends Component {
  constructor (props) {
    super(props)
    this.state = {
      seen: JSON.parse(localStorage.getItem('app_ad')) || false
    }
  }

  render ({ t }, { seen }) {
    if (seen) {
      return (
        <a href={t('Nav.link-client')} target='_blank' className={styles['coz-btn-client']}><span>{t('Nav.btn-client')}</span></a>
      )
    }
  }
}

export default translate()(ButtonClient)
