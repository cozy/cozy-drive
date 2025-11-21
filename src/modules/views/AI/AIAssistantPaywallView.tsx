import React from 'react'

import { useInstanceInfo } from 'cozy-client'
import { buildPremiumLink } from 'cozy-client/dist/models/instance'
import { AiAssistantPaywall } from 'cozy-ui-plus/dist/Paywall'

const AIAssistantPaywallView = (): JSX.Element => {
  const instanceInfo = useInstanceInfo()

  const onClose = (): void => {
    const link = buildPremiumLink(instanceInfo)
    window.open(link, '_self')
  }

  return <AiAssistantPaywall onClose={onClose} />
}

export default AIAssistantPaywallView
