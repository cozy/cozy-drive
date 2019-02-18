import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getPlatform } from 'cozy-device-helper'
import { Button } from 'cozy-ui/react'
//import flag from 'cozy-flags'

import { nativeLinkOpen } from '../LinkManager'

import { generateObjectForUrl, clearState } from '../utils/onboarding'

export class ButtonLinkRegistration extends Component {
  state = {
    onboardingObject: null
  }
  constructor(props) {
    super(props)

    if (this.props.onboarding && this.props.onboarding.oauth) {
      const {
        clientName,
        redirectURI,
        softwareID,
        softwareVersion,
        clientURI,
        logoURI,
        policyURI,
        scope
      } = this.props.onboarding.oauth

      generateObjectForUrl({
        clientName,
        redirectURI,
        softwareID,
        softwareVersion,
        clientURI,
        logoURI,
        policyURI,
        scope
      }).then(object => {
        this.setState({
          onboardingObject: object
        })
      })
    } else {
      this.setState({
        noOnboarding: {
          test: 'toto'
        }
      })
    }
  }
  render() {
    const {
      className = '',
      label,
      size,
      subtle = false,
      type = 'submit',
      theme = 'primary'
    } = this.props

    if (!this.state.onboardingObject) {
      return
    }
    const { onboardingObject } = this.state

    const url = `https://staging-manager.cozycloud.cc/cozy/create?domain=cozy.works&pk_campaign=drive-${getPlatform() ||
      'browser'}&onboarding=${onboardingObject}`

    return (
      <Button
        onClick={async () => {
          await clearState()
          return nativeLinkOpen({ url })
        }}
        theme={theme}
        href={url}
        label={label}
        size={size}
        className={className}
        subtle={subtle}
        type={type}
      />
    )
  }
}

ButtonLinkRegistration.propTypes = {
  beforeClick: PropTypes.func
}
