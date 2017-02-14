import React from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'

import { registerDevice, SET_URL } from '../../actions'
import styles from '../../styles/onboarding'

export const SelectServer = ({selectServer, t, updateServerUrl, serverUrl, error}) =>
(
  <div className={classnames(styles['wizard'])}>
    <div className={classnames(styles['wizard-main'])}>
      <p>{t('mobile.onboarding.server_selection.cozy_address')}</p>
      <input type='url' placeholder={t('mobile.onboarding.server_selection.cozy_address_placeholder')} onChange={updateServerUrl} value={serverUrl} />
      <p>{t('mobile.onboarding.server_selection.description')}</p>
      {error && <p style={{color: 'red'}}>{t(error)}</p>}
    </div>
    <button role='button' className={classnames('coz-btn coz-btn--regular', styles['wizard-button'])} onClick={selectServer}>{t('mobile.onboarding.server_selection.button')}</button>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectServer: () => {
    dispatch(registerDevice()).then(() => {
      ownProps.nextStep()
    })
  },
  updateServerUrl: (e) => {
    const serverUrl = e.target.value
    dispatch({ type: SET_URL, url: serverUrl })
  }
})

const mapStateToProps = (state) => {
  return ({
    serverUrl: state.mobile.serverUrl,
    error: state.mobile.error
  })
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectServer)
