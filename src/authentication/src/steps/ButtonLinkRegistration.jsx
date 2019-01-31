import React from 'react'
import { getPlatform } from 'cozy-device-helper'
import { Button } from 'cozy-ui/react'
import flag from 'cozy-flags'

import { nativeLinkOpen } from '../LinkManager'
export const ButtonLinkRegistration = ({
  className = '',
  label,
  size,
  subtle = false,
  type = 'submit'
}) => {
  const url = flag('beta-onboarding')
    ? `https://staging-manager.cozycloud.cc/cozy/create?domain=cozy.works&pk_campaign=drive-${getPlatform() ||
        'browser'}`
    : `https://manager.cozycloud.cc/cozy/create?pk_campaign=drive-${getPlatform() ||
        'browser'}`
  return (
    <Button
      onClick={() => {
        nativeLinkOpen({ url })
      }}
      href={url}
      label={label}
      size={size}
      className={className}
      subtle={subtle}
      type={type}
    />
  )
}
