import React from 'react'
import { connect } from 'react-redux'
import OnBoarding from '../../components/OnBoarding'
import { backupImages } from '../../actions/mediaBackup'

export const BackupPhotosVideos = ({ onActivate, onSkip }) =>
(
  <OnBoarding onActivate={onActivate} onSkip={onSkip} stepName='photos' currentStep={2} totalSteps={4} />
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
