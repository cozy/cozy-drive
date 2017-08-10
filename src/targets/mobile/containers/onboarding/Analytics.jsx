import React from 'react'
import { connect } from 'react-redux'
import OnBoarding from '../../components/OnBoarding'
import { setAnalytics } from '../../actions/settings'

export const Analytics = ({ onActivate, onSkip, breadcrumbs }) =>
(
  <OnBoarding onActivate={onActivate} onSkip={onSkip} stepName='analytics' breadcrumbs={breadcrumbs} />
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
