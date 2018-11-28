import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import { Button, MainTitle, Icon } from 'cozy-ui/react'
import '../assets/icons/icon-cozy.svg'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

import styles from '../styles.styl'
import { ButtonLinkRegistration } from './ButtonLinkRegistration'

export class Welcome extends Component {
  registerRender = () => {
    const {
      t,
      register,
      allowRegistration,
      breakpoints: { isMobile }
    } = this.props

    if (allowRegistration) {
      return (
        <Button
          theme="secondary"
          onClick={register}
          label={t('mobile.onboarding.welcome.sign_up')}
          size={isMobile ? 'normal' : 'large'}
        />
      )
    }
    return (
      <ButtonLinkRegistration
        label={t('mobile.onboarding.welcome.no_account_link')}
        size={isMobile ? 'normal' : 'large'}
      />
    )
  }

  render() {
    const {
      t,
      selectServer,
      breakpoints: { isMobile }
    } = this.props

    return (
      <div className={classNames(styles['wizard'], styles['wizard--welcome'])}>
        <div className={styles['wizard-wrapper']}>
          <div className={styles['wizard-main']}>
            <div className={styles['wizard-logo']}>
              <img
                className={styles['wizard-logo-img']}
                src={this.context.client.options.oauth.logoURI}
                alt=""
                aria-hidden="true"
                focusable="false"
              />
              <div className={styles['wizard-logo-badge']}>
                <Icon icon="icon-cozy" width="20" height="20" color="white" />
              </div>
            </div>
            <MainTitle
              tag="h1"
              className={classNames(
                styles['wizard-title'],
                'u-mb-1-half',
                'u-mt-0'
              )}
            >
              {t('mobile.onboarding.welcome.title')}
            </MainTitle>
            <p className={classNames(styles['wizard-desc'], 'u-mb-1-half')}>
              {t('mobile.onboarding.welcome.desc')}
            </p>
          </div>
          <footer className={styles['wizard-footer']}>
            {this.registerRender()}
            <Button
              onClick={selectServer}
              theme="secondary"
              label={t('mobile.onboarding.welcome.button')}
              size={isMobile ? 'normal' : 'large'}
            />
          </footer>
        </div>
      </div>
    )
  }
}

export default withBreakpoints()(translate()(Welcome))
