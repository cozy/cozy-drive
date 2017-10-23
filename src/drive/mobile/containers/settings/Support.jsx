import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import SettingCategory, {
  ELEMENT_CHECKBOX,
  ELEMENT_BUTTON
} from '../../components/SettingCategory'
import { setAnalytics } from '../../actions/settings'
import { logInfo } from '../../lib/reporter'
import { isOnline } from '../../lib/network'

export const Support = ({
  t,
  analytics,
  setAnalytics,
  isDebug,
  success,
  failure,
  offline,
  serverUrl
}) => (
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
        theme: 'regular',
        onClick: async () => {
          if (isOnline()) {
            try {
              await logInfo(
                t('mobile.settings.support.logs.title'),
                serverUrl,
                true
              )
              success()
            } catch (e) {
              failure()
            }
          } else {
            offline()
          }
        }
      }
    ]}
  />
)

const mapStateToProps = state => ({
  analytics: state.mobile.settings.analytics,
  serverUrl: state.mobile.settings.serverUrl
})

const mapDispatchToProps = dispatch => ({
  setAnalytics: value => dispatch(setAnalytics(value)),
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
  },
  offline: () => {
    dispatch({
      type: 'SEND_LOG_FAILURE',
      alert: {
        message: 'alert.offline'
      }
    })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(
  translate()(Support)
)
