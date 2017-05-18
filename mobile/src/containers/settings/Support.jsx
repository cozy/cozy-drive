import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../../../src/lib/I18n'
import SettingCategory, { ELEMENT_CHECKBOX } from '../../components/SettingCategory'
import { setAnalytics } from '../../actions/settings'

export const Support = ({ t, analytics, setAnalytics }) => (
  <SettingCategory
    title={t('mobile.settings.support.title')}
    elements={[
      {
        type: ELEMENT_CHECKBOX,
        title: t('mobile.settings.support.analytics.title'),
        label: t('mobile.settings.support.analytics.label'),
        id: 'analytics_checkbox',
        checked: analytics,
        onChange: setAnalytics
      }
    ]}
  />
)

const mapStateToProps = state => ({
  analytics: state.mobile.settings.analytics
})

const mapDispatchToProps = dispatch => ({
  setAnalytics: (e) => dispatch(setAnalytics(e.target.checked))
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Support))
