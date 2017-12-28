import React from 'react'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react'
import styles from '../styles/onboarding'

export const OnBoarding = ({
  t,
  breadcrumbs,
  onActivate,
  onSkip,
  stepName,
  currentStep,
  totalSteps
}) => (
  <div className={classNames(styles['wizard'], styles['photos-backup'])}>
    <header className={styles['wizard-header']}>
      {onSkip && (
        <a className={styles['skipLink']} onClick={onSkip}>
          {t('mobile.onboarding.step.skip')}
        </a>
      )}
    </header>
    <div className={styles['wizard-main']}>
      <div
        className={classNames(
          styles['illustration'],
          styles['illustration-' + stepName]
        )}
      />
      <h1 className={styles['title']}>
        {t('mobile.onboarding.' + stepName + '.title')}
      </h1>
      <p className={styles['description']}>
        {t('mobile.onboarding.' + stepName + '.description')}
      </p>
    </div>
    <footer className={styles['wizard-footer']}>
      <Button onClick={onActivate}>
        {onSkip && t('mobile.onboarding.step.button')}
        {!onSkip && t('mobile.onboarding.step.next')}
      </Button>
      {breadcrumbs}
    </footer>
  </div>
)

export default translate()(OnBoarding)
