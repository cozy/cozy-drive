import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import SettingCategory, {
  ELEMENT_CHECKBOX
} from '../../components/SettingCategory'
import { setBackupContacts } from '../../actions/settings'
import {
  requestDeviceAuthorization,
  requestCozyAuthorization,
  backupContacts
} from '../../actions/contactsBackup'

export const Contacts = ({ t, backup, setBackupContacts }) => (
  <SettingCategory
    title={t('mobile.settings.contacts.title')}
    elements={[
      {
        type: ELEMENT_CHECKBOX,
        title: t('mobile.settings.contacts.subtitle'),
        label: t('mobile.settings.contacts.text'),
        id: 'contact_checkbox',
        checked: backup,
        onChange: setBackupContacts
      }
    ]}
  />
)

const mapStateToProps = state => ({
  backup: state.mobile.settings.backupContacts
})

const mapDispatchToProps = dispatch => ({
  setBackupContacts: async shouldBackup => {
    dispatch(setBackupContacts(shouldBackup))

    // if contact syncing has been activated, prompt for authorization and start the first sync
    if (shouldBackup) {
      let devicePermissions = await requestDeviceAuthorization()
      let cozyPermissions = await dispatch(requestCozyAuthorization())

      if (devicePermissions && cozyPermissions) dispatch(backupContacts())
      else dispatch(setBackupContacts(false)) // authorization was rejected
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(Contacts)
)
