import React from 'react'
import { connect } from 'react-redux'
import OnBoarding from '../../components/OnBoarding'

export const Files = ({ onActivate }) =>
(
  <OnBoarding onActivate={onActivate} nameStep='files' currentStep={1} totalSteps={3} />
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: () => {
    ownProps.nextStep()
  }
})

export default connect(null, mapDispatchToProps)(Files)
