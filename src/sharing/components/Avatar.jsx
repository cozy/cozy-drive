import React from 'react'
import ColorHash from './colorhash'
import styles from './recipient.styl'

export const Avatar = ({ name, className }) => {
  const initial = name.charAt(0)
  const bg = ColorHash().getColor(name)
  const style = {
    'background-color': bg
  }
  return (
    <div className={styles['pho-recipient-avatar']} style={style}>
      <span>{initial}</span>
    </div>
  )
}
export default Avatar
