import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getPlatform } from 'cozy-device-helper'
import { Button } from 'cozy-ui/react'
//import flag from 'cozy-flags'

import { nativeLinkOpen } from '../LinkManager'

import {
  generateObjectForUrl,
  clearState,
  clearSecret
} from '../utils/onboarding'

export class ButtonLinkRegistration extends Component {
  state = {
    url: ''
  }
  async generateUrl() {
    await clearState()
    await clearSecret()
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
    const onboardingObject = await generateObjectForUrl({
      clientName,
      redirectURI,
      softwareID,
      softwareVersion,
      clientURI,
      logoURI,
      policyURI,
      scope
    })
    const url = `https://staging-manager.cozycloud.cc/cozy/create?domain=cozy.works&pk_campaign=drive-${getPlatform() ||
      'browser'}&onboarding=${onboardingObject}`
    this.setState({ url })
    return url
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
    const { url } = this.state
    return (
      <Button
        onClick={async () => {
          const generatedUrl = await this.generateUrl()
          return nativeLinkOpen({ url: generatedUrl })
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
  onboarding: PropTypes.object.isRequired
}
