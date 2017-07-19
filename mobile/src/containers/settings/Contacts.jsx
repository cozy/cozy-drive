import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import SettingCategory, { ELEMENT_CHECKBOX } from '../../components/SettingCategory'
import { setBackupContacts } from '../../actions/settings'

export const Support = ({ t, backup, setBackupContacts }) => (
  <SettingCategory
    title={'Contacts'}
    elements={[
      {
        type: ELEMENT_CHECKBOX,
        title: 'contacts titre',
        label: 'contacts explication',
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
  setBackupContacts: (value) => dispatch(setBackupContacts(value))
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Support))
