import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { translate } from '../../../src/lib/I18n'

import Wizard from '../components/Wizard'

import styles from '../styles/onboarding'
import { SETUP } from '../actions'

import logo from '../../res/icon.png'

export const SelectServer = ({selectServer, t}) =>
(
  <div className={classnames(styles['wizard'])}>
    <div className={classnames(styles['wizard-main'])}>
      <p>{t('mobile.wizard.selectServer.cozy_address')}</p>
      <input type='text' placeholder={t('mobile.wizard.selectServer.cozy_address_placeholder')} />
      <p>{t('mobile.wizard.selectServer.description')}</p>
    </div>
    <button role='button' className={classnames('coz-btn coz-btn--regular', styles['wizard-button'])} onClick={selectServer}>{t('mobile.wizard.selectServer.button')}</button>
  </div>
)

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectServer: () => {
    dispatch({ type: SETUP })
    const { router, location } = ownProps
    if (location.state && location.state.nextPathname) {
      router.replace(location.state.nextPathname)
    } else {
      router.replace('/')
    }
  }
})

const ConnectedSelectServer = connect(null, mapDispatchToProps)(SelectServer)

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
