import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { translate } from '../../../src/lib/I18n'

import styles from '../styles/onboarding'

export const OnBoarding = ({t, isLoggedIn, onClick, children}) => {
  if (!isLoggedIn) {
    return (
      <div class={classnames(styles['wizard'])}>
        <p>{t('mobile.wizard.cozy_address')}</p>
        <input type='text' placeholder={t('mobile.wizard.cozy_address_placeholder')} />
        <p>{t('mobile.wizard.description')}</p>
        <button role='button' className='coz-btn coz-btn--regular' onClick={onClick}>{t('mobile.wizard.next')}</button>
      </div>)
  }
  return children
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.mobile.loggedIn
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch({
      type: 'LOGGED_IN'
    })
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(translate()(OnBoarding))
