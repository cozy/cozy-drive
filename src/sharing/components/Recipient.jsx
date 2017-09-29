import styles from './recipient.styl'

import React from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import ColorHash from './colorhash'
import Menu, { Item } from '../../photos/components/Menu'

import { getPrimaryEmail, getPrimaryCozy } from '..'

const Avatar = ({ name }) => {
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

const Identity = ({ name, url }) => (
  <div className={styles['pho-recipient-idents']}>
    <div className={styles['pho-recipient-user']}>{name}</div>
    <div className={styles['pho-recipient-url']}>{url}</div>
  </div>
)

export const UserAvatar = ({ name, url }) => (
  <div className={styles['pho-avatar']}>
    <Avatar name={name} />
    <Identity name={name} url={url} />
  </div>
)

const Recipient = ({ t, contact, status, documentType, onUnshare }) => {
  const name = getPrimaryEmail(contact)
  const url = getPrimaryCozy(contact)
  return (
    <div className={styles['pho-recipient']}>
      <Avatar name={name} />
      <Identity name={name} url={url} />
      {status && (
        <div className={styles['pho-recipient-status']}>
          <Menu
            title={status}
            className={styles['pho-recipient-menu']}
            buttonClassName={styles['pho-recipient-menu-btn']}
            disabled={status === 'pending'}
          >
            <Item>
              <a
                className={classNames(styles['pho-action-unshare'])}
                onClick={() => onUnshare(contact)}
              >
                {t(`${documentType}.share.unshare.title`)}
              </a>
            </Item>
          </Menu>
        </div>
      )}
    </div>
  )
}

export default translate()(Recipient)
