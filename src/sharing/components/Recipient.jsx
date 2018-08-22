import React, { Component } from 'react'
import classNames from 'classnames'
import { Spinner, Menu, MenuItem, withBreakpoints, Icon } from 'cozy-ui/react'
import { Avatar, AvatarPlusX, AvatarLink } from './Avatar'

import styles from './recipient.styl'

import IconHourglass from '../assets/icons/icon-hourglass-16.svg'
import IconEye from '../assets/icons/icon-eye-16.svg'
import IconPen from '../assets/icons/icon-pen-write-16.svg'
import IconTrash from '../assets/icons/icon-trash-red.svg'

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

  getStatusIcon = type => {
    switch (type) {
      case 'one-way':
        return IconEye
      case 'two-way':
        return IconPen
      default:
        return IconHourglass
    }
  }

  render() {
    const {
      isOwner,
      status,
      instance,
      type,
      documentType,
      breakpoints: { isMobile }
    } = this.props
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
            text={
              status === 'ready' && type
                ? t(`Share.type.${type}`)
                : t(`Share.status.${status}`)
            }
            className={styles['recipient-menu']}
            buttonClassName={styles['recipient-menu-btn']}
            position={isMobile ? 'left' : 'right'}
          >
            <MenuItem icon={<Icon icon={this.getStatusIcon(status)} />}>
              {status === 'ready' && type
                ? t(`Share.type.${type}`)
                : t(`Share.status.${status}`)}
            </MenuItem>
            <hr />
            <MenuItem onSelect={this.onRevoke} icon={<Icon icon={IconTrash} />}>
              <div className={styles['action-unshare']}>
                {isOwner
                  ? t(`${documentType}.share.revoke.title`)
                  : t(`${documentType}.share.revokeSelf.title`)}
              </div>
              <p className={styles['action-unshare-desc']}>
                {isOwner
                  ? t(`${documentType}.share.revoke.desc`)
                  : t(`${documentType}.share.revokeSelf.desc`)}
              </p>
            </MenuItem>
          </Menu>
        )}
      </div>
    )
  }
}

const StatusWithBreakpoints = withBreakpoints()(Status)

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
        <StatusWithBreakpoints {...props} />
      </div>
    </div>
  )
}

export default Recipient

export const RecipientWithoutStatus = ({ instance, ...rest }) => {
  const name = getDisplayName(rest)
  return (
    <div className={styles['recipient']}>
      <Avatar name={name} />
      <div className={styles['recipient-ident-status']}>
        <Identity name={name} url={instance} />
      </div>
    </div>
  )
}

export const RecipientPlusX = ({ extraRecipients }, { t }) => (
  <div className={styles['recipient']}>
    <AvatarPlusX
      extraRecipients={extraRecipients.map(recipient =>
        getDisplayName(recipient)
      )}
    />
    <div className={styles['recipient-ident-status']}>
      <Identity
        name={t('Share.members.otherContacts', extraRecipients.length)}
      />
    </div>
  </div>
)

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
