import React from 'react'
import ColorHash from './colorhash'
import PropTypes from 'prop-types'
import { SharingTooltip, TooltipRecipientList } from './Tooltip'
import styles from './recipient.styl'

export const Avatar = ({ name = '' }) => {
  const initial = name.charAt(0)
  const bg = ColorHash().getColor(name)
  const style = {
    'background-color': bg
  }
  return (
    <div
      className={styles['recipient-avatar']}
      style={style}
      data-tip={name}
      data-for={`recipient-avatar-${name}`}
    >
      <span>{initial}</span>
      <SharingTooltip id={`recipient-avatar-${name}`} />
    </div>
  )
}

Avatar.propTypes = {
  name: PropTypes.string
}

Avatar.defaultProps = {
  name: ''
}

export const AvatarPlusX = ({ extraRecipients = [] }) => (
  <div
    className={styles['recipient-avatar']}
    data-tip
    data-for="extra-recipients-avatar"
  >
    <span className={styles['recipient-avatar-plusx']}>
      +{Math.min(extraRecipients.length, 99)}
    </span>
    <SharingTooltip id="extra-recipients-avatar">
      <TooltipRecipientList recipientNames={extraRecipients} />
    </SharingTooltip>
  </div>
)

AvatarPlusX.propTypes = {
  extraRecipients: PropTypes.arrayOf(PropTypes.string)
}

AvatarPlusX.defaultProps = {
  extraRecipients: []
}

export const AvatarLink = () => (
  <div className={styles['recipient-avatar']}>
    <span className={styles['recipient-avatar-link']} />
  </div>
)
