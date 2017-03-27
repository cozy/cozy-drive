import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { translate } from '../../../../src/lib/I18n'
import Breadcrumb from '../../components/Breadcrumb'
import styles from '../../styles/onboarding'

export const Files = ({ t, onActivate, onSkip }) =>
(
  <div className={classNames(styles['wizard'], styles['files'])}>
    <header className={styles['wizard-header']}>
    </header>
    <div className={styles['wizard-main']}>
      <div className={classNames(styles['illustration'], styles['illustration-files'])} />
      <h1 className={styles['title']}>{t('mobile.onboarding.files.title')}</h1>
      <p className={styles['description']}>{t('mobile.onboarding.files.description')}</p>
    </div>
    <footer className={styles['wizard-footer']}>
      <button
        role='button'
        className={'coz-btn coz-btn--regular'}
        onClick={onActivate}
      >
        {t('mobile.onboarding.files.button')}
      </button>
      <Breadcrumb currentStep={1} totalSteps={3} />
    </footer>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: () => {
    ownProps.nextStep()
  }
})

export default connect(null, mapDispatchToProps)(translate()(Files))
