import React from 'react'

import Wizard from '../components/Wizard'
import Welcome from './onboarding/Welcome'
import SelectServer from './onboarding/SelectServer'
import BackupPhotosVideos from './onboarding/BackupPhotosVideos'
import Analytic from './onboarding/Analytic'

const OnBoarding = (props) => {
  const steps = [
    Welcome,
    SelectServer,
    BackupPhotosVideos,
    Analytic
  ]
  return <Wizard steps={steps} {...props} />
}

export default OnBoarding
