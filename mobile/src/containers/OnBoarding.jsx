import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { translate } from '../../../src/lib/I18n'

import styles from '../styles/onboarding'

const OnBoarding = ({t, isLoggedIn, onClick, children}) => {
  if (!isLoggedIn) {
    return (
      <div class={classnames(styles['wizard'])}>
        <p>{t('wizard.cozy_address')}</p>
        <input type="text" placeholder={t('wizard.cozy_address_placeholder')} />
        <p>{t('wizard.description')}</p>
        <button role="button" className="coz-btn coz-btn--regular" onClick={onClick}>{t('wizard.next')}</button>
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
