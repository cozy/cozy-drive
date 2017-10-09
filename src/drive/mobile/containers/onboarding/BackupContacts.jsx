import React from 'react'
import { connect } from 'react-redux'
import OnBoarding from '../../components/OnBoarding'
import { setBackupContacts } from '../../actions/settings'
import { requestDeviceAuthorization } from '../../actions/contactsBackup'

export const BackupContacts = ({ onActivate, onSkip, breadcrumbs }) => (
  <OnBoarding
    onActivate={onActivate}
    onSkip={onSkip}
    stepName="contacts"
    breadcrumbs={breadcrumbs}
  />
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
