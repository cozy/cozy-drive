import React from 'react'
import { getPlatform } from 'cozy-device-helper'
import { Button } from 'cozy-ui/react'

import { nativeLinkOpen } from '../LinkManager'
export const ButtonLinkRegistration = ({
  className = '',
  label,
  size,
  subtle = false,
  type = 'submit'
}) => {
  const url = `https://manager.cozycloud.cc/cozy/create?pk_campaign=drive-${getPlatform() ||
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
