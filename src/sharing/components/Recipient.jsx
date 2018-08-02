import React, { Component } from 'react'
import classNames from 'classnames'
import { Spinner } from 'cozy-ui/react'
import Menu, { Item } from 'components/Menu'
import { Avatar, AvatarPlusX, AvatarLink } from './Avatar'

import styles from './recipient.styl'

import { getDisplayName, getPrimaryEmail, getPrimaryCozy } from '..'

const MAX_DISPLAYED_RECIPIENTS = 3

export const RecipientsAvatars = ({ recipients, link, size, className }) => {
  // we reverse the recipients array because we use `flex-direction: row-reverse` to display them correctly
  // we slice first to clone the original array because reverse() mutates it
  const reversedRecipients = recipients.slice().reverse()
  return (
    <div className={classNames(styles['recipients-avatars'], className)}>
      {link && <AvatarLink size={size} />}
      {recipients.length > MAX_DISPLAYED_RECIPIENTS && (
        <AvatarPlusX
          extraRecipients={reversedRecipients
            .slice(MAX_DISPLAYED_RECIPIENTS)
            .map(recipient => getDisplayName(recipient))}
          size={size}
        />
      )}
      {reversedRecipients
        .slice(0, MAX_DISPLAYED_RECIPIENTS)
        .map(recipient => (
          <Avatar name={getDisplayName(recipient)} size={size} />
        ))}
    </div>
  )
}

const Identity = ({ name, url }) => (
  <div className={styles['recipient-idents']}>
    <div className={styles['recipient-user']}>{name}</div>
    <div className={styles['recipient-url']}>{url}</div>
  </div>
)

export const UserAvatar = ({ url, ...rest }) => (
  <div className={styles['avatar']}>
    <Avatar name={getDisplayName(rest)} />
    <Identity name={getDisplayName(rest)} url={url} />
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
    const { t, client } = this.context
    const { revoking } = this.state
    const isMe =
      instance !== undefined && instance === client.options.uri && !isOwner
    const shouldShowMenu = !revoking && status !== 'owner' && (isMe || isOwner)
    return (
      <div className={styles['recipient-status']}>
        {revoking && <Spinner />}
        {!shouldShowMenu && <span>{t(`Share.status.${status}`)}</span>}
        {shouldShowMenu && (
          <Menu
            title={
              status === 'ready' && type
                ? t(`Share.type.${type}`)
                : t(`Share.status.${status}`)
            }
            className={styles['recipient-menu']}
            buttonClassName={styles['recipient-menu-btn']}
            disabled={status === 'pending'}
          >
            <Item>
              <div
                className={classNames(
                  styles['recipient-menu-header'],
                  status === 'ready' && type
                    ? styles[`recipient-menu-header--${type}`]
                    : styles[`recipient-menu-header--${status}`]
                )}
              >
                {status === 'ready' && type
                  ? t(`Share.type.${type}`)
                  : t(`Share.status.${status}`)}
              </div>
            </Item>
            <hr />
            <Item>
              <a className={styles['action-unshare']} onClick={this.onRevoke}>
                {isOwner
                  ? t(`${documentType}.share.revoke.title`)
                  : t(`${documentType}.share.revokeSelf.title`)}
              </a>
              <p className={styles['action-unshare-desc']}>
                {isOwner
                  ? t(`${documentType}.share.revoke.desc`)
                  : t(`${documentType}.share.revokeSelf.desc`)}
              </p>
            </Item>
          </Menu>
        )}
      </div>
    )
  }
}

const Recipient = (props, { t, client }) => {
  const { instance, isOwner, status, ...rest } = props
  const isMe =
    (isOwner && status === 'owner') || instance === client.options.uri
  const name = getDisplayName(rest)
  return (
    <div className={styles['recipient']}>
      <Avatar name={name} />
      <div className={styles['recipient-ident-status']}>
        <Identity
          name={isMe ? t('Share.recipients.you') : name}
          url={instance}
        />
        <Status {...props} />
      </div>
    </div>
  )
}

export default Recipient

export const Contact = ({ contact }) => {
  const name = getPrimaryEmail(contact)
  const url = getPrimaryCozy(contact)
  return (
    <div className={styles['recipient']}>
      <Avatar name={name} />
      <Identity name={name} url={url} />
    </div>
  )
}
