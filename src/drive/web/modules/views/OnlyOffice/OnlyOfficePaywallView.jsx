import React from 'react'
import { useNavigate } from 'react-router-dom'

import { OnlyOfficePaywall } from 'cozy-ui/transpiled/react/Paywall'

const OnlyOfficePaywallView = ({ isPublic = false }) => {
  const navigate = useNavigate()

  const onClose = () => {
    navigate('..')
  }

  return <OnlyOfficePaywall isPublic={isPublic} onClose={onClose} />
}

export default OnlyOfficePaywallView
