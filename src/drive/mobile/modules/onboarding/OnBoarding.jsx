import React from 'react'
import { useNavigate } from 'react-router-dom'

import Wizard from './components/Wizard'
import Files from './components/Files'
import BackupPhotosVideos from './components/BackupPhotosVideos'
import Analytics from './components/Analytics'
import localforage from 'localforage'
export const ONBOARDED_ITEM = 'ONBOARDED'

const OnBoarding = () => {
  const navigate = useNavigate()
  const onboardingSteps = [Files, BackupPhotosVideos, Analytics]

  return (
    <Wizard
      steps={onboardingSteps}
      onComplete={() => {
        localforage.setItem(ONBOARDED_ITEM, true)
        navigate('/')
      }}
    />
  )
}

export default OnBoarding
