import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { translate } from '../../../src/lib/I18n'

import Wizard from '../components/Wizard'

import styles from '../styles/onboarding'
import { SETUP } from '../actions'

export const SelectServer = ({selectServer, t}) =>
(
  <div className={classnames(styles['wizard'])}>
    <p>{t('mobile.wizard.cozy_address')}</p>
    <input type='text' placeholder={t('mobile.wizard.cozy_address_placeholder')} />
    <p>{t('mobile.wizard.description')}</p>
    <button role='button' className='coz-btn coz-btn--regular' onClick={selectServer}>{t('mobile.wizard.next')}</button>
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
  <div className={classnames(styles['wizard'])}>
    <img src={'path_to_the_icon'} height='120' width='120' />
    <h1>{t('mobile.wizard.welcome')}</h1>
    <button role='button' className='coz-btn coz-btn--regular' onClick={nextStep}>{t('mobile.wizard.connect')}</button>
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
