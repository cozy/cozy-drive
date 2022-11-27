import React from 'react'
import { connect } from 'react-redux'
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
    ownProps.nextStep()
  },
  onSkip: () => {
    ownProps.nextStep()
  }
})

export default connect(null, mapDispatchToProps)(Analytics)
