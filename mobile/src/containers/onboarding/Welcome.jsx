import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'

import styles from '../../styles/onboarding'
import { getPlatformId } from '../../lib/device'

export class Welcome extends Component {
  constructor (props) {
    super(props)

    this.platform = getPlatformId() !== undefined ? getPlatformId() : 'browser'
  }

  render () {
    const { nextStep, t } = this.props

    return (
      <div className={classNames(styles['wizard'], styles['welcome'])}>
        <div className={styles['wizard-main']}>
          <div className={styles['logo-wrapper']}>
            <div className={styles['cozy-logo-white']} />
          </div>
          <h1 className={styles['title']}>
            {t('mobile.onboarding.welcome.title1')}
          </h1>
          <h1 className={styles['title']}>
            {t('mobile.onboarding.welcome.title2')}
          </h1>
        </div>
        <footer className={styles['wizard-footer']}>
          <button role='button'
            className='coz-btn coz-btn--regular'
            onClick={nextStep}
          >
            {t('mobile.onboarding.welcome.button')}
          </button>
          <a href={`https://cozy.io/fr/try-it?from=io.cozy.drive.mobile&os=${this.platform}`} className={styles['link']}>
            {t('mobile.onboarding.welcome.no_account_link')}
          </a>
        </footer>
      </div>
    )
  }
}

export default connect()(translate()(Welcome))
