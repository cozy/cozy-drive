import React from 'react'
import { connect } from 'react-redux'
import OnBoarding from '../../components/OnBoarding'
import { setAnalytics } from '../../actions/settings'

export const Analytics = ({ onActivate, onSkip }) =>
(
  <OnBoarding onActivate={onActivate} onSkip={onSkip} stepName='analytics' currentStep={3} totalSteps={3} />
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: () => {
    dispatch(setAnalytics(true))
    ownProps.nextStep()
  },
  onSkip: () => {
    dispatch(setAnalytics(false))
    ownProps.nextStep()
  }
})

export default connect(null, mapDispatchToProps)(Analytics)
