import React from 'react'
import { connect } from 'react-redux'
import { backupImages } from 'drive/mobile/modules/mediaBackup/duck'
import OnBoardingStep from './OnBoardingStep'

export const BackupPhotosVideos = ({ onActivate, onSkip, breadcrumbs }) => (
  <OnBoardingStep
    onActivate={onActivate}
    onSkip={onSkip}
    stepName="photos"
    breadcrumbs={breadcrumbs}
  />
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: async () => {
    await dispatch(backupImages(true))
    ownProps.nextStep()
  },
  onSkip: () => {
    dispatch(backupImages(false))
    ownProps.nextStep()
  }
})

export default connect(null, mapDispatchToProps)(BackupPhotosVideos)
