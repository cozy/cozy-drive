import styles from './recipient.styl'

import React, { Component } from 'react'
import classNames from 'classnames'
import Spinner from 'cozy-ui/react/Spinner'
import ColorHash from './colorhash'
import Menu, { Item } from 'components/Menu'

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

export const RecipientsAvatars = ({ recipients }) => (
  <div className={styles['pho-recipients-avatars']}>
    {recipients.map(({ name }) => <Avatar name={name} />)}
  </div>
)

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

class Status extends Component {
  state = {
    revoking: false
  }

  onRevoke = async () => {
    const { onRevoke, document, email } = this.props
    this.setState(state => ({ revoking: true }))
    await onRevoke(document, email)
    this.setState(state => ({ revoking: false }))
  }

  render() {
    const { isOwner, status, instance, type, documentType } = this.props
    const { t } = this.context
    const { revoking } = this.state
    const isMe = instance !== undefined && !isOwner
    const shouldShowMenu = !revoking && status !== 'owner' && (isMe || isOwner)
    return (
      <div className={styles['pho-recipient-status']}>
        {revoking && <Spinner />}
        {!shouldShowMenu && <span>{t(`Share.status.${status}`)}</span>}
        {shouldShowMenu && (
          <Menu
            title={
              status === 'ready' && type
                ? t(`Share.type.${type}`)
                : t(`Share.status.${status}`)
            }
            className={styles['pho-recipient-menu']}
            buttonClassName={styles['pho-recipient-menu-btn']}
            disabled={status === 'pending'}
          >
            <Item>
              <a
                className={classNames(styles['pho-action-unshare'])}
                onClick={this.onRevoke}
              >
                {isOwner
                  ? t(`${documentType}.share.revoke.title`)
                  : t(`${documentType}.share.revokeSelf.title`)}
              </a>
            </Item>
          </Menu>
        )}
      </div>
    )
  }
}

const Recipient = ({ instance, name, ...rest }) => (
  <div className={styles['pho-recipient']}>
    <Avatar name={name} />
    <Identity name={name} url={instance} />
    <Status instance={instance} {...rest} />
  </div>
)

export default Recipient

export const Contact = ({ contact }) => {
  const name = getPrimaryEmail(contact)
  const url = getPrimaryCozy(contact)
  return (
    <div className={styles['pho-recipient']}>
      <Avatar name={name} />
      <Identity name={name} url={url} />
    </div>
  )
}
