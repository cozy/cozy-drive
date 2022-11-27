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
import { getServerUrl } from '../duck'

export const Support = ({ t, isDebug, serverUrl, sendFeedback }) => (
  <SettingCategory
    title={t('mobile.settings.support.title')}
    elements={[
      {
        type: ELEMENT_CHECKBOX,
        title: t('mobile.settings.support.analytics.title'),
        label: t('mobile.settings.support.analytics.label'),
        id: 'analytics_checkbox'
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
  serverUrl: getServerUrl(state)
})

export default connect(mapStateToProps)(translate()(Support))
