import React from 'react'
import { connect } from 'react-redux'
import { setAnalytics } from 'drive/mobile/modules/settings/duck'
import OnBoardingStep from './OnBoardingStep'

export const Analytics = ({ onActivate, onSkip, breadcrumbs }) => (
  <OnBoardingStep
    onActivate={onActivate}
    onSkip={onSkip}
    stepName="analytics"
    breadcrumbs={breadcrumbs}
  />
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: () => {
    dispatch(setAnalytics(true, 'onboarbing'))
    ownProps.nextStep()
  },
  onSkip: () => {
    dispatch(setAnalytics(false))
    ownProps.nextStep()
  }
})

export default connect(null, mapDispatchToProps)(Analytics)
