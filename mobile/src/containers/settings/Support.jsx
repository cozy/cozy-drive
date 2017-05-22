import React from 'react'
import { connect } from 'react-redux'
import { translate } from '../../../../src/lib/I18n'
import SettingCategory, { ELEMENT_CHECKBOX, ELEMENT_BUTTON } from '../../components/SettingCategory'
import { setAnalytics } from '../../actions/settings'
import { sendLog } from '../../lib/reporter'

export const Support = ({ t, analytics, setAnalytics, isDebug, success, failure }) => (
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
      },
      {
        type: ELEMENT_BUTTON,
        display: isDebug,
        title: t('mobile.settings.support.logs.title'),
        description: t('mobile.settings.support.logs.description'),
        text: t('mobile.settings.support.logs.button'),
        theme: 'secondary',
        onClick: async () => {
          try {
            await sendLog(t('mobile.settings.support.logs.title'))
            success()
          } catch (e) {
            failure()
          }
        }
      }
    ]}
  />
)

const mapStateToProps = state => ({
  analytics: state.mobile.settings.analytics
})

const mapDispatchToProps = dispatch => ({
  setAnalytics: (value) => dispatch(setAnalytics(value)),
  success: () => {
    dispatch({
      type: 'SEND_LOG_SUCCESS',
      alert: {
        message: 'mobile.settings.support.logs.success'
      }
    })
  },
  failure: () => {
    dispatch({
      type: 'SEND_LOG_FAILURE',
      alert: {
        message: 'mobile.settings.support.logs.error'
      }
    })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Support))
