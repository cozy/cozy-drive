import React from 'react'

import Wizard from './components/Wizard'
import Files from './components/Files'
import BackupPhotosVideos from './components/BackupPhotosVideos'
import Analytics from './components/Analytics'
import localforage from 'localforage'
export const ONBOARDED_ITEM = 'ONBOARDED'

const OnBoarding = ({ router }) => {
  const onboardingSteps = [Files, BackupPhotosVideos, Analytics]

  const redirectToApp = async () => {
    router.replace('/')
  }

  return (
    <Wizard
      steps={onboardingSteps}
      onComplete={() => {
        localforage.setItem(ONBOARDED_ITEM, true)
        return redirectToApp()
      }}
    />
  )
}

export default OnBoarding
