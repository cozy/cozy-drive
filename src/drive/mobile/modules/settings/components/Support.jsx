import React from 'react'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import Alerter from 'cozy-ui/transpiled/react/Alerter'
import { logInfo } from 'drive/lib/reporter'
import { isOnline } from 'drive/mobile/lib/network'
import SettingCategory, {
  ELEMENT_CHECKBOX,
  ELEMENT_BUTTON
} from './SettingCategory'
import { setAnalytics, getServerUrl, isAnalyticsOn } from '../duck'

export const Support = ({
  t,
  analytics,
  setAnalytics,
  isDebug,
  serverUrl,
  sendFeedback
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
              await logInfo(t('mobile.settings.support.logs.title'), serverUrl)
              Alerter.info('mobile.settings.support.logs.success')
            } catch (e) {
              Alerter.error('mobile.settings.support.logs.error')
            }
          } else {
            Alerter.error('alert.offline')
          }
        }
      },
      {
        type: ELEMENT_BUTTON,
        title: t('mobile.settings.support.feedback.title'),
        description: t('mobile.settings.support.feedback.description'),
        text: t('mobile.settings.support.feedback.button'),
        theme: 'regular',
        onClick: () => {
          sendFeedback()
        }
      }
    ]}
  />
)

const mapStateToProps = state => ({
  analytics: isAnalyticsOn(state),
  serverUrl: getServerUrl(state)
})

const mapDispatchToProps = dispatch => ({
  setAnalytics: value => dispatch(setAnalytics(value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(translate()(Support))
