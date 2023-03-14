import React from 'react'

import { OnlyOfficePaywall } from 'cozy-ui/transpiled/react/Paywall'

import { useRouter } from 'drive/lib/RouterContext'

const OnlyOfficePaywallView = ({ isPublic = false }) => {
  const { router } = useRouter()

  const onClose = () => {
    router.replace(`${router.location.pathname.replace('/paywall', '')}`)
  }

  return <OnlyOfficePaywall isPublic={isPublic} onClose={onClose} />
}

export default OnlyOfficePaywallView
