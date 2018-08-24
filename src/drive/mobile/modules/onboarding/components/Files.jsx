import React from 'react'
import { connect } from 'react-redux'
import OnBoardingStep from './OnBoardingStep'

export const Files = ({ onActivate, breadcrumbs }) => (
  <OnBoardingStep
    onActivate={onActivate}
    stepName="files"
    breadcrumbs={breadcrumbs}
  />
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: () => {
    ownProps.nextStep()
  }
})

export default connect(null, mapDispatchToProps)(Files)
