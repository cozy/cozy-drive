import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import SettingCategory, { ELEMENT_CHECKBOX } from '../../components/SettingCategory'
import { setBackupContacts } from '../../actions/settings'
import { requestAuthorization, backupContacts } from '../../actions/contactsBackup'

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
  setBackupContacts: async (value) => {
    dispatch(setBackupContacts(value))

    // if contact syncing has been activated, prompt for authorization and start the first sync
    if (value) {
      value = await requestAuthorization()

      if (value === false) dispatch(setBackupContacts(value)) // authorization was rejected
      else dispatch(backupContacts())
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Contacts))
