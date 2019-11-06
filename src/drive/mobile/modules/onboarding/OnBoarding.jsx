import React, { Component } from 'react'

import Wizard from './components/Wizard'
import Files from './components/Files'
import BackupPhotosVideos from './components/BackupPhotosVideos'
import Analytics from './components/Analytics'
import localforage from 'localforage'
export const ONBOARDED_ITEM = 'ONBOARDED'
export default class OnBoarding extends Component {
  onboardingSteps = [Files, BackupPhotosVideos, Analytics]

  async redirectToApp() {
    this.props.router.replace('/')
  }

  render() {
    return (
      <Wizard
        steps={this.onboardingSteps}
        onComplete={() => {
          localforage.setItem(ONBOARDED_ITEM, true)
          return this.redirectToApp()
        }}
      />
    )
  }
}
