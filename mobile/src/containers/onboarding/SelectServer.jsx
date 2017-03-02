import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { translate } from '../../../../src/lib/I18n'

import { registerDevice, setUrl } from '../../actions/settings'
import styles from '../../styles/onboarding'

export const SelectServer = ({selectServer, t, updateServerUrl, serverUrl, error, authorized}) =>
(
  <div className={classNames(styles['wizard'], styles['select-server'])}>
    <div className={styles['wizard-main']}>
      <div className={styles['logo-wrapper']}>
        <div className={styles['cozy-logo-white']} />
      </div>
      <input
        type='url'
        className={styles['input']}
        placeholder={t('mobile.onboarding.server_selection.cozy_address_placeholder')}
        onChange={updateServerUrl}
        value={serverUrl}
      />
      {!error &&
        <p className={styles['description']}>
          {t('mobile.onboarding.server_selection.description')}
        </p>
      }
      {error &&
        <p className={styles['description']} style={{color: 'red'}}>
          {t(error)}
        </p>
      }
    </div>
    <footer className={styles['wizard-footer']}>
      <button
        role='button'
        className={'coz-btn coz-btn--regular'}
        onClick={() => selectServer(serverUrl, authorized)}
      >
        {t('mobile.onboarding.server_selection.button')}
      </button>
    </footer>
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
