import styles from './pushClient'

import { translate } from 'cozy-ui/react/I18n'

import React, { Component } from 'react'
import { getTracker } from 'cozy-ui/react/helpers/tracker'

const track = (element) => {
  const tracker = getTracker()
  if (!tracker) {
    return
  }
  tracker.push(['trackEvent', 'interaction', 'desktop-prompt', element])
}

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
        <a href={t('Nav.link-client')} target='_blank' className={styles['coz-btn-client']} onClick={e => track('button')}><span>{t('Nav.btn-client')}</span></a>
      )
    }
  }
}

export default translate()(ButtonClient)
