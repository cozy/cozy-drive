import React from 'react'
import cx from 'classnames'
import ColorHash from './colorhash'
import PropTypes from 'prop-types'
import { SharingTooltip, TooltipRecipientList } from './Tooltip'
import styles from './recipient.styl'

export const Avatar = ({ name, size }) => {
  const initial = name.charAt(0)
  const bg = ColorHash().getColor(name)
  const style = {
    'background-color': bg
  }
  return (
    <div
      className={cx(styles['recipient-avatar'], {
        [styles['recipient-avatar--small']]: size === 'small'
      })}
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
  name: PropTypes.string,
  size: PropTypes.string
}

Avatar.defaultProps = {
  name: '',
  size: 'medium'
}

export const AvatarPlusX = ({ size, extraRecipients = [] }) => (
  <div
    className={cx(styles['recipient-avatar'], {
      [styles['recipient-avatar--small']]: size === 'small'
    })}
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
  extraRecipients: PropTypes.arrayOf(PropTypes.string),
  size: PropTypes.string
}

AvatarPlusX.defaultProps = {
  extraRecipients: [],
  size: 'medium'
}

export const AvatarLink = ({ size = 'medium' }) => (
  <div
    className={cx(styles['recipient-avatar'], {
      [styles['recipient-avatar--small']]: size === 'small'
    })}
  >
    <span className={styles['recipient-avatar-link']} />
  </div>
)
