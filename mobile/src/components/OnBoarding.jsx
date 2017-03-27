import React from 'react'
import classNames from 'classnames'

import { translate } from '../../../src/lib/I18n'
import Breadcrumb from './Breadcrumb'
import styles from '../styles/onboarding'

export const OnBoarding = ({ t, onActivate, onSkip, nameStep, currentStep, totalSteps }) =>
(
  <div className={classNames(styles['wizard'], styles['photos-backup'])}>
    <header className={styles['wizard-header']}>
      {onSkip && <a className={styles['skipLink']} onClick={onSkip}>
        {t('mobile.onboarding.step.skip')}
      </a>}
    </header>
    <div className={styles['wizard-main']}>
      <div className={classNames(styles['illustration'], styles['illustration-' + nameStep])} />
      <h1 className={styles['title']}>{t('mobile.onboarding.' + nameStep + '.title')}</h1>
      <p className={styles['description']}>{t('mobile.onboarding.' + nameStep + '.description')}</p>
    </div>
    <footer className={styles['wizard-footer']}>
      <button
        role='button'
        className={'coz-btn coz-btn--regular'}
        onClick={onActivate}
      >
        {onSkip && t('mobile.onboarding.step.button')}
        {!onSkip && t('mobile.onboarding.step.next')}
      </button>
      <Breadcrumb currentStep={currentStep} totalSteps={totalSteps} />
    </footer>
  </div>
)

export default translate()(OnBoarding)
