import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react'

import styles from '../styles'

export class Welcome extends Component {
  render() {
    const { t, selectServer, register, allowRegistration } = this.props

    return (
      <div className={classNames(styles['wizard'], styles['welcome'])}>
        <div className={styles['wizard-main']}>
          <div className={styles['logo-wrapper']}>
            <div className={styles['cozy-logo-white']} />
          </div>
          <h1 className={styles['title']}>
            {t('mobile.onboarding.welcome.title1')}
          </h1>
          <h1 className={styles['title']}>
            {t('mobile.onboarding.welcome.title2')}
          </h1>
        </div>
        <footer className={styles['wizard-footer']}>
          <Button onClick={selectServer}>
            {t('mobile.onboarding.welcome.button')}
          </Button>
          {allowRegistration ? (
            <a className={styles['link']} onClick={register}>
              {t('mobile.onboarding.welcome.sign_up')}
            </a>
          ) : (
            <a
              href={`https://cozy.io/fr/try-it?from=io.cozy.drive.mobile&os=${
                this.platform
              }`}
              className={styles['link']}
            >
              {t('mobile.onboarding.welcome.no_account_link')}
            </a>
          )}
        </footer>
      </div>
    )
  }
}

export default connect()(translate()(Welcome))
