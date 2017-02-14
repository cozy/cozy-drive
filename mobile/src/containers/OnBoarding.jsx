import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { translate } from '../../../src/lib/I18n'

import Wizard from '../components/Wizard'

import styles from '../styles/onboarding'
import { registerDevice, SET_URL } from '../actions'

import logo from '../../res/icon.png'

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
    const { router, location } = ownProps
    dispatch(registerDevice()).then(() => {
      if (location.state && location.state.nextPathname) {
        router.replace(location.state.nextPathname)
      } else {
        router.replace('/')
      }
    })
  },
  updateServerUrl: (e) => {
    const serverUrl = e.target.value
    dispatch({ type: SET_URL, url: serverUrl })
  }
})

const mapStateToProps = (state) => {
  return ({
    serverUrl: state.mobile.settings.serverUrl,
    error: state.mobile.error
  })
}
const ConnectedSelectServer = connect(mapStateToProps, mapDispatchToProps)(SelectServer)

export const Welcome = ({ nextStep, t }) =>
(
  <div className={classnames(styles['wizard'], styles['welcome'])}>
    <div className={classnames(styles['wizard-main'])}>
      <img src={logo} alt='logo' />
      <h1>{t('mobile.onboarding.welcome.title')}</h1>
    </div>
    <button role='button' className={classnames('coz-btn coz-btn--regular', styles['wizard-button'])} onClick={nextStep}>{t('mobile.onboarding.welcome.button')}</button>
  </div>
)

const OnBoarding = (props) => {
  const steps = [
    Welcome,
    ConnectedSelectServer
  ]
  return <Wizard steps={steps} {...props} />
}

export default translate()(OnBoarding)
