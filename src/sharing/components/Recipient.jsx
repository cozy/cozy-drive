import React, { Component } from 'react'
import classNames from 'classnames'
import { Spinner } from 'cozy-ui/react'
import Menu, { Item } from 'components/Menu'
import { Avatar, AvatarPlusX, AvatarLink } from './Avatar'

import styles from './recipient.styl'

import { getDisplayName, getPrimaryEmail, getPrimaryCozy } from '..'

const MAX_DISPLAYED_RECIPIENTS = 3

export const RecipientsAvatars = ({ recipients, link }) => (
  <div className={styles['pho-recipients-avatars']}>
    {link && <AvatarLink />}
    {recipients.length > MAX_DISPLAYED_RECIPIENTS && (
      <AvatarPlusX
        count={Math.min(recipients.length - MAX_DISPLAYED_RECIPIENTS, 99)}
      />
    )}
    {recipients
      .slice(-MAX_DISPLAYED_RECIPIENTS)
      .map(recipient => <Avatar name={getDisplayName(recipient)} />)}
  </div>
)

const Identity = ({ name, url }) => (
  <div className={styles['pho-recipient-idents']}>
    <div className={styles['pho-recipient-user']}>{name}</div>
    <div className={styles['pho-recipient-url']}>{url}</div>
  </div>
)

export const UserAvatar = ({ url, ...rest }) => (
  <div className={styles['pho-avatar']}>
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
              <div
                className={classNames(
                  styles['pho-recipient-menu-header'],
                  status === 'ready' && type
                    ? styles[`pho-recipient-menu-header--${type}`]
                    : styles[`pho-recipient-menu-header--${status}`]
                )}
              >
                {status === 'ready' && type
                  ? t(`Share.type.${type}`)
                  : t(`Share.status.${status}`)}
              </div>
            </Item>
            <hr />
            <Item>
              <a
                className={styles['pho-action-unshare']}
                onClick={this.onRevoke}
              >
                {isOwner
                  ? t(`${documentType}.share.revoke.title`)
                  : t(`${documentType}.share.revokeSelf.title`)}
              </a>
              <p className={styles['pho-action-unshare-desc']}>
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
    <div className={styles['pho-recipient']}>
      <Avatar name={name} />
      <div className={styles['pho-recipient-ident-status']}>
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
    <div className={styles['pho-recipient']}>
      <Avatar name={name} />
      <Identity name={name} url={url} />
    </div>
  )
}
