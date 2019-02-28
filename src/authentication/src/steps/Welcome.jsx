import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/react/I18n'
import { Button, MainTitle, Icon } from 'cozy-ui/react'
import 'cozy-ui/assets/icons/ui/cozy-negative.svg'
import withBreakpoints from 'cozy-ui/react/helpers/withBreakpoints'

import styles from '../styles.styl'
import { ButtonLinkRegistration } from './ButtonLinkRegistration'
import { onboardingPropTypes } from '../../OnboardingPropTypes'
export class Welcome extends Component {
  registerRender = () => {
    const {
      t,
      register,
      allowRegistration,
      breakpoints: { isMobile },
      onboarding
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
        label={t('mobile.onboarding.welcome.create_my_cozy')}
        size={isMobile ? 'normal' : 'large'}
        onboarding={onboarding}
      />
    )
  }

  render() {
    const {
      t,
      selectServer,
      breakpoints: { isMobile },
      appIcon
    } = this.props
    return (
      <div className={classNames(styles['wizard'])}>
        <div
          className={classNames(
            styles['wizard-wrapper'],
            styles['wizard-wrapper--center']
          )}
        >
          <div className={styles['wizard-main']}>
            <div className={styles['wizard-logo']}>
              <img
                className={styles['wizard-logo-img']}
                src={appIcon}
                alt=""
                aria-hidden="true"
                focusable="false"
              />
              <div className={styles['wizard-logo-badge']}>
                <Icon
                  icon="cozy-negative"
                  width="20"
                  height="20"
                  color="white"
                />
              </div>
            </div>
            <MainTitle
              tag="h1"
              className={classNames(styles['wizard-title'], 'u-mt-0')}
            >
              {t('mobile.onboarding.welcome.title')}
            </MainTitle>
            <p className={styles['wizard-desc']}>
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

Welcome.propTypes = {
  selectServer: PropTypes.func.isRequired,
  appIcon: PropTypes.string.isRequired,
  onboarding: onboardingPropTypes.isRequired
}
export default withBreakpoints()(translate()(Welcome))
