import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { translate } from '../../../../src/lib/I18n'

import Breadcrumb from '../../components/Breadcrumb'

import styles from '../../styles/onboarding.styl'

import { setBackupImages } from '../../actions/settings'

export const BackupPhotosVideos = ({ t, onActivate, onSkip }) =>
(
  <div className={classNames(styles['wizard'], styles['photos-backup'])}>
    <header className={styles['wizard-header']}>
      <a className={styles['skipLink']} onClick={onSkip}>
        {t('mobile.onboarding.photos.skip')}
      </a>
    </header>
    <div className={styles['wizard-main']}>
      <div className={classNames(styles['illustration'], styles['illustration-photos'])} />
      <h1 className={styles['title']}>{t('mobile.onboarding.photos.title')}</h1>
      <p className={styles['description']}>{t('mobile.onboarding.photos.description')}</p>
    </div>
    <footer className={styles['wizard-footer']}>
      <button
        role='button'
        className={'coz-btn coz-btn--regular'}
        onClick={onActivate}
      >
        {t('mobile.onboarding.photos.button')}
      </button>
      <Breadcrumb currentStep={1} totalSteps={4} />
    </footer>
  </div>
)

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: () => {
    dispatch(setBackupImages(true))
    ownProps.nextStep()
  },
  onSkip: () => {
    dispatch(setBackupImages(false))
    ownProps.nextStep()
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(BackupPhotosVideos))
