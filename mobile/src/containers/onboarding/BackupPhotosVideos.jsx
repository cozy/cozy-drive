import React from 'react'
import { connect } from 'react-redux'
import OnBoarding from '../../components/OnBoarding'
import { setBackupImages } from '../../actions/settings'

export const BackupPhotosVideos = ({ onActivate, onSkip }) =>
(
  <OnBoarding onActivate={onActivate} onSkip={onSkip} nameStep='photos' currentStep={2} totalSteps={3} />
)

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

export default connect(null, mapDispatchToProps)(BackupPhotosVideos)
