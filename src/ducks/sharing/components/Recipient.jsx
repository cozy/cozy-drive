import styles from '../../../styles/recipient'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'

export const Recipient = ({ t, name, url, status }) => {
  return (
    <div className={styles['pho-recipient']}>
      <div className={styles['pho-recipient-idents']}>
        <div className={styles['pho-recipient-user']}>{name}</div>
        <div className={styles['pho-recipient-url']}>{url}</div>
      </div>
      <div className={styles['pho-recipient-status']}>{status}</div>
    </div>
  )
}

export default translate()(Recipient)
