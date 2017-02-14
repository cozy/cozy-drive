import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import styles from '../../styles/onboarding.styl'

import logo from '../../../res/icon.png'

export const BackupPhotosVideos = ({ t, onActivate, onSkip }) =>
(
  <div className={classnames(styles['wizard'], styles['activation'])}>
    <div className={classnames(styles['wizard-main'])}>
      <img src={logo} alt='logo' />
      <h1>{t('mobile.onboarding.activation.backupPhotosVideos.title')}</h1>
      <p>{t('mobile.onboarding.activation.backupPhotosVideos.description')}</p>
    </div>
    <a onClick={onSkip}>{t('mobile.onboarding.activation.skip')}</a>
    <button role='button' className={classnames('coz-btn coz-btn--regular', styles['wizard-button'], styles['wizard-button--with-circles'])} onClick={onActivate}>{t('mobile.onboarding.activation.button')}</button>
    <div className={classnames(styles['wizard-circles'])}>
      <span className={classnames(styles['wizard-circles__circle'], styles['wizard-circles__circle--active'])} />
      <span className={classnames(styles['wizard-circles__circle'])} />
      <span className={classnames(styles['wizard-circles__circle'])} />
      <span className={classnames(styles['wizard-circles__circle'])} />
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
