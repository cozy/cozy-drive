import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../../../src/lib/I18n'
import SettingCategory, { ELEMENT_TEXT } from '../../components/SettingCategory'

export const About = ({ t, version, serverUrl, onClick }) => (
  <SettingCategory
    title={t('mobile.settings.about.title')}
    elements={[
      {
        type: ELEMENT_TEXT,
        label: t('mobile.settings.about.account'),
        value: <a href='{serverUrl}'>{serverUrl}</a>
      },
      {
        type: ELEMENT_TEXT,
        label: t('mobile.settings.about.app_version'),
        value: version,
        onClick
      }
    ]}
  />
)

const mapStateToProps = state => ({
  version: window.navigator.appInfo ? window.navigator.appInfo.version : 'dev',
  serverUrl: state.mobile.settings.serverUrl
})

export default connect(mapStateToProps)(translate()(About))
