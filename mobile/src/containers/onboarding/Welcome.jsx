import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'

import styles from '../../styles/onboarding'
import logo from '../../../res/icon.png'

export const Welcome = ({ nextStep, t }) =>
(
  <div className={classnames(styles['wizard'], styles['welcome'])}>
    <div className={classnames(styles['wizard-main'])}>
      <img src={logo} alt='logo' />
      <h1>{t('mobile.onboarding.welcome.title')}</h1>
    </div>
    <button role='button' className={classnames('coz-btn coz-btn--regular', styles['wizard-button'])} onClick={nextStep}>{t('mobile.onboarding.welcome.button')}</button>
  </div>
)

export default connect()(Welcome)
