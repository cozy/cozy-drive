import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { translate } from '../../../../src/lib/I18n'

import { registerDevice, setUrl } from '../../actions/settings'
import styles from '../../styles/onboarding'

export const SelectServer = ({selectServer, t, updateServerUrl, serverUrl, error, authorized}) =>
(
  <div className={classnames(styles['wizard'])}>
    <div className={classnames(styles['wizard-main'])}>
      <p>{t('mobile.onboarding.server_selection.cozy_address')}</p>
      <input type='url' placeholder={t('mobile.onboarding.server_selection.cozy_address_placeholder')} onChange={updateServerUrl} value={serverUrl} />
      <p>{t('mobile.onboarding.server_selection.description')}</p>
      {error && <p style={{color: 'red'}}>{t(error)}</p>}
    </div>
    <button
      role='button'
      className={classnames('coz-btn coz-btn--regular', styles['wizard-button'])}
      onClick={() => selectServer(serverUrl, authorized)}
    >
      {t('mobile.onboarding.server_selection.button')}
    </button>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectServer: (serverUrl, authorized) => {
    if (!serverUrl) return
    dispatch(registerDevice())
      .then(() => {
        if (authorized) ownProps.nextStep()
      })
      .catch((err) => console.error(err))
  },
  updateServerUrl: (e) => {
    const serverUrl = e.target.value
    dispatch(setUrl(serverUrl))
  }
})

const mapStateToProps = (state) => {
  return ({
    serverUrl: state.mobile.settings.serverUrl,
    error: state.mobile.settings.error,
    authorized: state.mobile.settings.authorized
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(SelectServer))
