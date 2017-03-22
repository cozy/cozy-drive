import React from 'react'

import Wizard from '../components/Wizard'
import Welcome from './onboarding/Welcome'
import SelectServer from './onboarding/SelectServer'
import BackupPhotosVideos from './onboarding/BackupPhotosVideos'
import Analytics from './onboarding/Analytics'

const OnBoarding = (props) => {
  const steps = [
    Welcome,
    SelectServer,
    BackupPhotosVideos,
    Analytics
  ]
  return <Wizard steps={steps} {...props} />
}

export default OnBoarding
