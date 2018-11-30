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
  /* 
  if (hasSafariPlugin()) {
    const openManager = () => {
      window.SafariViewController.show(
        {
          url: url,
          transition: 'curl'
        },
        result => {
          if (result.event === 'closed') {
            window.SafariViewController.hide()
          }
        },
        error => {
          console.warn(error)
          window.SafariViewController.hide()
        }
      )
    }
 */
  /*  return (
      <Button
        onClick={openManager}
        label={label}
        size={size}
        className={className}
        subtle={subtle}
        type={type}
      />
    )
  } */

  return (
    <Button
      onClick={e => {
        console.log('clic')
        nativeLinkOpen({ e, url })
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
