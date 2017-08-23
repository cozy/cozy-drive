import styles from './recipient.styl'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import ColorHash from '../colorhash'

export const Recipient = ({ name, url, status }) => {
  const initial = name.charAt(0)
  const bg = ColorHash().getColor(name)
  const style = {
    'background-color': bg
  }
  return (
    <div className={styles['pho-recipient']}>
      <div
        className={styles['pho-recipient-avatar']}
        style={style}>
        <span>{initial}</span>
      </div>
      <div className={styles['pho-recipient-idents']}>
        <div className={styles['pho-recipient-user']}>{name}</div>
        <div className={styles['pho-recipient-url']}>{url}</div>
      </div>
      { status && <div className={styles['pho-recipient-status']}>{status}</div> }
    </div>
  )
}

export default Recipient
