import React from 'react'
import { connect } from 'react-redux'
import OnBoarding from '../../components/OnBoarding'
import { setBackupContacts } from '../../actions/settings'
import { requestDeviceAuthorization } from '../../actions/contactsBackup'

export const BackupContacts = ({ onActivate, onSkip }) =>
(
  <OnBoarding onActivate={onActivate} onSkip={onSkip} stepName='contacts' currentStep={3} totalSteps={4} />
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivate: async () => {
    let devicePermissions = await requestDeviceAuthorization()
    if (devicePermissions) await dispatch(setBackupContacts(true))
    ownProps.nextStep()
  },
  onSkip: () => {
    dispatch(setBackupContacts(false))
    ownProps.nextStep()
  }
})

export default connect(null, mapDispatchToProps)(BackupContacts)
