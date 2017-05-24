import React from 'react'
import { connect } from 'react-redux'
import OnBoarding from '../../components/OnBoarding'
import { backupImages } from '../../actions/mediaBackup'
import { translate } from '../../../../src/lib/I18n'

export const BackupPhotosVideos = ({ onActivate, onSkip }) =>
(
  <OnBoarding onActivate={onActivate} onSkip={onSkip} stepName='photos' currentStep={2} totalSteps={3} />
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: async () => {
    const path = ownProps.t('mobile.settings.media_backup.media_folder')
    await dispatch(backupImages(path, true))
    ownProps.nextStep()
  },
  onSkip: () => {
    const path = ownProps.t('mobile.settings.media_backup.media_folder')
    dispatch(backupImages(path, false))
    ownProps.nextStep()
  }
})

export default translate()(connect(null, mapDispatchToProps)(BackupPhotosVideos))
