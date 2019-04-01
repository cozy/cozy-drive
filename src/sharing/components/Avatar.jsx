import React from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { SharingTooltip, TooltipRecipientList } from './Tooltip'
import styles from './recipient.styl'
import ColorHash from './colorhash'

export const Avatar = ({ text, size, textId }) => {
  const initial = text.charAt(0)
  const bg = ColorHash().getColor(textId)
  const style = {
    backgroundColor: bg
  }
  return (
    <div
      className={cx(styles['recipient-avatar'], {
        [styles['recipient-avatar--small']]: size === 'small'
      })}
      style={style}
      data-tip={textId}
      data-for={`recipient-avatar-${text}`}
    >
      <span>{initial}</span>
      <SharingTooltip id={`recipient-avatar-${text}`} />
    </div>
  )
}

Avatar.propTypes = {
  text: PropTypes.string,
  size: PropTypes.string,
  textId: PropTypes.string
}

Avatar.defaultProps = {
  text: '',
  size: 'small-plus',
  textId: ''
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
