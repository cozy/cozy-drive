import React, { Component } from 'react'

import Wizard from '../components/Wizard'

import Files from './onboarding/Files'
import BackupPhotosVideos from './onboarding/BackupPhotosVideos'
import BackupContacts from './onboarding/BackupContacts'
import Analytics from './onboarding/Analytics'

import { initBar } from 'drive/mobile/lib/cozy-helper'

export default class OnBoarding extends Component {
  onboardingSteps = [Files, BackupPhotosVideos, BackupContacts, Analytics]

  redirectToApp() {
    initBar(this.context.client)
    this.props.router.replace('/')
  }

  render() {
    return (
      <Wizard
        steps={this.onboardingSteps}
        onComplete={() => this.redirectToApp()}
      />
    )
  }
}
