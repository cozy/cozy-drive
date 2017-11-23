import React from 'react'
import { connect } from 'react-redux'
import OnBoardingStep from '../../components/OnBoardingStep'
import { backupImages } from 'drive/mobile/ducks/mediaBackup'

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
