import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { translate } from '../../../src/lib/I18n'

import styles from '../styles/onboarding'
import { SETUP } from '../actions'

export const OnBoarding = ({t, onClick}) =>
  (
    <div className={classnames(styles['wizard'])}>
      <p>{t('mobile.wizard.cozy_address')}</p>
      <input type='text' placeholder={t('mobile.wizard.cozy_address_placeholder')} />
      <p>{t('mobile.wizard.description')}</p>
      <button role='button' className='coz-btn coz-btn--regular' onClick={onClick}>{t('mobile.wizard.next')}</button>
    </div>
  )

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch({ type: SETUP })
    const { router, location } = ownProps
    if (location.state && location.state.nextPathname) {
      router.replace(location.state.nextPathname)
    } else {
      router.replace('/')
    }
  }
})

export default connect(null, mapDispatchToProps)(translate()(OnBoarding))
