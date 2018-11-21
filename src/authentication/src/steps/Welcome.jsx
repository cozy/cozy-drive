import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react'
import { withHasSafariPlugin } from '../withHasSafariPlugin'

import styles from '../styles.styl'

const isCordova = () => window.cordova !== undefined
const getPlatformId = () =>
  isCordova() ? window.cordova.platformId : undefined

export class Welcome extends Component {
  registerRender = () => {
    const { t, register, allowRegistration, hasSafariPlugin } = this.props

    if (allowRegistration) {
      return (
        <a className={styles['link']} onClick={register}>
          {t('mobile.onboarding.welcome.sign_up')}
        </a>
      )
    }

    const url = `https://manager.cozycloud.cc/cozy/create?pk_campaign=drive-${getPlatformId() ||
      'browser'}`

    if (hasSafariPlugin) {
      const openManager = () => {
        window.SafariViewController.show(
          {
            url: url,
            transition: 'curl'
          },
          result => {
            if (result.event === 'closed') {
              window.SafariViewController.hide()
            }
          },
          error => {
            console.warn(error)
            window.SafariViewController.hide()
          }
        )
      }

      return (
        <a className={styles['link']} onClick={openManager}>
          {t('mobile.onboarding.welcome.no_account_link')}
        </a>
      )
    }

    return (
      <a href={url} className={styles['link']}>
        {t('mobile.onboarding.welcome.no_account_link')}
      </a>
    )
  }

  render() {
    const { t, selectServer } = this.props

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
          <Button
            onClick={selectServer}
            label={t('mobile.onboarding.welcome.button')}
          />
          {this.registerRender()}
        </footer>
      </div>
    )
  }
}

export default withHasSafariPlugin()(translate()(Welcome))
