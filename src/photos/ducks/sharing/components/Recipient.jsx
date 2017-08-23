import styles from './recipient.styl'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { ColorHash } from '../colorhash'

export const Recipient = ({ t, name, url, status }) => {
  const initial = name.charAt(0)
  const bg = ColorHash.getColor(name)
  return (
    <div className={styles['pho-recipient']}>
      <div
        className={styles['pho-recipient-avatar']}
        style={`background-color:#${bg}`}>
        <span>{initial}</span>
      </div>
      <div className={styles['pho-recipient-idents']}>
        <div className={styles['pho-recipient-user']}>{name}</div>
        <div className={styles['pho-recipient-url']}>{url}</div>
      </div>
      <div className={styles['pho-recipient-status']}>{status}</div>
    </div>
  )
}

export default translate()(Recipient)
