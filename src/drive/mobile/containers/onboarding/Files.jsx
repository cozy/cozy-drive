import React from 'react'
import { connect } from 'react-redux'
import OnBoarding from '../../components/OnBoarding'

export const Files = ({ onActivate, breadcrumbs }) => (
  <OnBoarding
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
