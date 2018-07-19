import React from 'react'
import ColorHash from './colorhash'
import styles from './recipient.styl'
import PropTypes from 'prop-types'

export const Avatar = ({ name = '' }) => {
  const initial = name.charAt(0)
  const bg = ColorHash().getColor(name)
  const style = {
    'background-color': bg
  }
  return (
    <div className={styles['recipient-avatar']} style={style}>
      <span>{initial}</span>
    </div>
  )
}

Avatar.propTypes = {
  name: PropTypes.string
}

Avatar.defaultProps = {
  name: ''
}

export const AvatarPlusX = ({ count = 1 }) => (
  <div className={styles['recipient-avatar']}>
    <span className={styles['recipient-avatar-plusx']}>+{count}</span>
  </div>
)

AvatarPlusX.propTypes = {
  count: PropTypes.number
}

AvatarPlusX.defaultProps = {
  count: 1
}

export const AvatarLink = () => (
  <div className={styles['recipient-avatar']}>
    <span className={styles['recipient-avatar-link']} />
  </div>
)
