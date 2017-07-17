import styles from '../styles/recipient'

import React from 'react'
import { translate } from 'cozy-ui/react/I18n'
import classNames from 'classnames'

export const Recipient = ({ t, name, url, status }) => {
  return (
    <div className={classNames(styles['pho-recipient'])}>
      <div className={classNames(styles['pho-recipient-idents'])}>
        <div className={classNames(styles['pho-recipient-user'])}>{name}</div>
        <div className={classNames(styles['pho-recipient-url'])}>{url}</div>
      </div>
      <div className={classNames(styles['pho-recipient-status'])}>{status}</div>
    </div>
  )
}

export default translate()(Recipient)
