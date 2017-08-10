import React from 'react'

import Wizard from '../components/Wizard'
import Welcome from './onboarding/Welcome'
import SelectServer from './onboarding/SelectServer'
import Files from './onboarding/Files'
import BackupPhotosVideos from './onboarding/BackupPhotosVideos'
import BackupContacts from './onboarding/BackupContacts'
import Analytics from './onboarding/Analytics'

const OnBoarding = (props) => {
  const steps = [
    Welcome,
    SelectServer
  ]
  const stepsWithBreadcrumb = [
    Files,
    BackupPhotosVideos,
    BackupContacts,
    Analytics
  ]
  return <Wizard steps={steps} breadcrumbSteps={stepsWithBreadcrumb} {...props} />
}

export default OnBoarding
