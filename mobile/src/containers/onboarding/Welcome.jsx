import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'

import { translate } from '../../../../src/lib/I18n'

import styles from '../../styles/onboarding'

export const Welcome = ({ nextStep, t }) =>
(
  <div className={classNames(styles['wizard'], styles['welcome'])}>
    <div className={styles['wizard-main']}>
      <figure>
        <div className={styles['logo-wrapper']}>
          <div className={styles['cozy-logo-white']} />
        </div>
      </figure>
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
      <a href='#' className={styles['link']}>
        {t('mobile.onboarding.welcome.no_account_link')}
      </a>
    </footer>
  </div>
)

export default connect()(translate()(Welcome))
