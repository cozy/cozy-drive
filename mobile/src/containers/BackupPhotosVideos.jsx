import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import styles from '../styles/onboarding.styl'

import logo from '../../res/icon.png'

export const BackupPhotosVideos = ({ t, onActivate, onSkip }) =>
(
  <div className={classnames(styles['wizard'], styles['activation'])}>
    <div className={classnames(styles['wizard-main'])}>
      <img src={logo} alt='logo' />
      <h1>{t('mobile.onboarding.activation.backupPhotosVideos.title')}</h1>
      <p>{t('mobile.onboarding.activation.backupPhotosVideos.description')}</p>
    </div>
    <button role='button' className={classnames('coz-btn coz-btn--regular', styles['wizard-button'])} onClick={onActivate}>{t('mobile.onboarding.activation.button')}</button>
    <a onClick={onSkip}>{t('mobile.onboarding.activation.skip')}</a>
    <div className={classnames(styles['breadcrumb'])}>
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: () => {
    dispatch({ type: 'UPDATE_SETTINGS', newSettings: { backupImages: true } })
    ownProps.nextStep()
  },
  onSkip: () => {
    dispatch({ type: 'UPDATE_SETTINGS', newSettings: { backupImages: false } })
    ownProps.nextStep()
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(BackupPhotosVideos)
