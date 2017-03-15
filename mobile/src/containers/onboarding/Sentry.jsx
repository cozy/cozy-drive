import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { translate } from '../../../../src/lib/I18n'

import Breadcrumb from '../../components/Breadcrumb'

import styles from '../../styles/onboarding'

import { setSentry } from '../../actions/settings'

export const Sentry = ({ t, onActivate, onSkip }) =>
(
  <div className={classNames(styles['wizard'], styles['sentry'])}>
    <header className={styles['wizard-header']}>
      <a className={styles['skipLink']} onClick={onSkip}>
        {t('mobile.onboarding.step.skip')}
      </a>
    </header>
    <div className={styles['wizard-main']}>
      <div className={classNames(styles['illustration'], styles['illustration-trophy'])} />
      <h1 className={styles['title']}>{t('mobile.onboarding.sentry.title')}</h1>
      <p className={styles['description']}>{t('mobile.onboarding.sentry.description')}</p>
    </div>
    <footer className={styles['wizard-footer']}>
      <button
        role='button'
        className={'coz-btn coz-btn--regular'}
        onClick={onActivate}
      >
        {t('mobile.onboarding.step.button')}
      </button>
      <Breadcrumb currentStep={2} totalSteps={2} />
    </footer>
  </div>
)

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: () => {
    dispatch(setSentry(true))
    ownProps.nextStep()
  },
  onSkip: () => {
    dispatch(setSentry(false))
    ownProps.nextStep()
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Sentry))
