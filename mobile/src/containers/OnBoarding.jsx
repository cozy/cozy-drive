import React from 'react'

import Wizard from '../components/Wizard'
import Welcome from './onboarding/Welcome'
import SelectServer from './onboarding/SelectServer'
import BackupPhotosVideos from './onboarding/BackupPhotosVideos'
import Sentry from './onboarding/Sentry'

const OnBoarding = (props) => {
  const steps = [
    Welcome,
    SelectServer,
    BackupPhotosVideos,
    Sentry
  ]
  return <Wizard steps={steps} {...props} />
}

export default OnBoarding
