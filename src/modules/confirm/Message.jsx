import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/deprecated/Media'

/**
 * Used to display a message and an icon
 * in a confirmation dialog
 *
 * @param {string} icon name forbidden / restore
 * @param {string} text Text to display
 */
export const Message = ({ icon, text }) => {
  return (
    <Media>
      <Img>
        <Icon icon={icon} color="var(--coolGrey)" />
      </Img>
      <Bd className="u-pl-1-half">{text}</Bd>
    </Media>
  )
}
