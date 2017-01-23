import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { translate } from '../../../src/lib/I18n'

import Wizard from '../components/Wizard'

import styles from '../styles/onboarding'
import { setupServerUrl, SET_URL } from '../actions'

import logo from '../../res/icon.png'

export const SelectServer = ({selectServer, t, updateServerUrl, serverUrl}) =>
(
  <div className={classnames(styles['wizard'])}>
    <div className={classnames(styles['wizard-main'])}>
      <p>{t('mobile.wizard.selectServer.cozy_address')}</p>
      <input type='text' placeholder={t('mobile.wizard.selectServer.cozy_address_placeholder')} onChange={updateServerUrl} value={serverUrl} />
      <p>{t('mobile.wizard.selectServer.description')}</p>
    </div>
    <button role='button' className={classnames('coz-btn coz-btn--regular', styles['wizard-button'])} onClick={selectServer}>{t('mobile.wizard.selectServer.button')}</button>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectServer: () => {
    const { router, location } = ownProps
    dispatch(setupServerUrl(router, location))
  },
  updateServerUrl: (e) => {
    const serverUrl = e.target.value
    dispatch({ type: SET_URL, url: serverUrl })
  }
})

const mapStateToProps = (state) => {
  return ({
    serverUrl: state.mobile.serverUrl
  })
}
const ConnectedSelectServer = connect(mapStateToProps, mapDispatchToProps)(SelectServer)

export const Welcome = ({ nextStep, t }) =>
(
  <div className={classnames(styles['wizard'], styles['welcome'])}>
    <div className={classnames(styles['wizard-main'])}>
      <img src={logo} alt='logo' />
      <h1>{t('mobile.wizard.welcome.title')}</h1>
    </div>
    <button role='button' className={classnames('coz-btn coz-btn--regular', styles['wizard-button'])} onClick={nextStep}>{t('mobile.wizard.welcome.button')}</button>
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
