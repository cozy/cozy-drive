import React, { Component } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Spinner, MenuItem, withBreakpoints, Icon } from 'cozy-ui/react'

import MenuAwareMobile from '../../components/Menu/Menuawaremobile'
import { AvatarPlusX, AvatarLink, Avatar } from './Avatar'

import styles from './recipient.styl'

import IconHourglass from '../assets/icons/icon-hourglass-16.svg'
import IconEye from '../assets/icons/icon-eye-16.svg'
import IconPen from '../assets/icons/icon-pen-write-16.svg'
import IconTrash from '../assets/icons/icon-trash-red.svg'

import { Contact } from 'models'
import Identity from 'sharing/components/Identity'

const MAX_DISPLAYED_RECIPIENTS = 3

export const RecipientsAvatars = ({
  recipients,
  link,
  size = 'small-plus',
  className,
  onClick
}) => {
  // we reverse the recipients array because we use `flex-direction: row-reverse` to display them correctly
  // we slice first to clone the original array because reverse() mutates it
  const reversedRecipients = recipients.slice().reverse()
  return (
    <div
      className={classNames(
        styles['recipients-avatars'],
        {
          [styles['--interactive']]: onClick
        },
        className
      )}
      onClick={onClick}
    >
      {link && <AvatarLink size={size} />}
      {recipients.length > MAX_DISPLAYED_RECIPIENTS && (
        <AvatarPlusX
          extraRecipients={reversedRecipients
            .slice(MAX_DISPLAYED_RECIPIENTS)
            .map(recipient => Contact.getDisplayName(recipient))}
          size={size}
        />
      )}
      {reversedRecipients.slice(0, MAX_DISPLAYED_RECIPIENTS).map(recipient => (
        <Avatar
          key={`key_avatar_${recipient.email}`}
          text={Contact.getInitials(recipient)}
          size={size}
          textId={Contact.getDisplayName(recipient)}
        />
      ))}
    </div>
  )
}

export const UserAvatar = ({ url, size, ...rest }) => (
  <div className={styles['avatar']}>
    <Avatar
      text={Contact.getInitials(rest)}
      size={size}
      textId={Contact.getDisplayName(rest)}
    />
    <Identity name={Contact.getDisplayName(rest)} details={url} />
  </div>
)

class Status extends Component {
  state = {
    revoking: false
  }

  static contextTypes = {
    t: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired
  }

  onRevoke = async () => {
    const { onRevoke, document, sharingId, index } = this.props
    this.setState({ revoking: true })
    await onRevoke(document, sharingId, index)
    this.setState({ revoking: false })
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
    const { isOwner, status, instance, type, documentType, name } = this.props
    const { t, client } = this.context
    const { revoking } = this.state
    const isMe =
      instance !== undefined && instance === client.options.uri && !isOwner
    const shouldShowMenu = !revoking && status !== 'owner' && (isMe || isOwner)
    return (
      <div className={classNames(styles['recipient-status'], 'u-ml-1')}>
        {revoking && <Spinner />}
        {!shouldShowMenu && (
          <span className={styles['recipient-owner']}>
            {t(`Share.status.${status}`)}
          </span>
        )}
        {shouldShowMenu && (
          <MenuAwareMobile
            text={
              status === 'ready' && type
                ? t(`Share.type.${type}`)
                : t(`Share.status.${status}`)
            }
            className={styles['recipient-menu']}
            buttonClassName={styles['recipient-menu-btn']}
            position={'right'}
            popover
            itemsStyle={{
              maxWidth: '280px'
            }}
            name={name}
          >
            <MenuItem icon={<Icon icon={this.getStatusIcon(status)} />}>
              {status === 'ready' && type
                ? t(`Share.type.${type}`)
                : t(`Share.status.${status}`)}
            </MenuItem>

            <hr />
            <MenuItem
              onSelect={this.onRevoke}
              onClick={this.onRevoke}
              icon={<Icon icon={IconTrash} />}
            >
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
          </MenuAwareMobile>
        )}
      </div>
    )
  }
}

const StatusWithBreakpoints = withBreakpoints()(Status)

const Recipient = (props, { client, t }) => {
  const { instance, isOwner, status, ...rest } = props
  const isMe =
    (isOwner && status === 'owner') || instance === client.options.uri
  const name = Contact.getDisplayName(rest)
  return (
    <div className={classNames(styles['recipient'], 'u-mt-1')}>
      <Avatar
        text={Contact.getInitials(rest)}
        size={'small-plus'}
        textId={name}
      />
      <div className={styles['recipient-ident-status']}>
        <Identity
          name={isMe ? t('Share.recipients.you') : name}
          details={instance}
        />
        <StatusWithBreakpoints {...props} name={name} />
      </div>
    </div>
  )
}

Recipient.contextTypes = {
  client: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
}

export default Recipient

export const RecipientWithoutStatus = ({ instance, ...rest }) => {
  const name = Contact.getDisplayName(rest)
  return (
    <div className={styles['recipient']}>
      <Avatar
        text={Contact.getInitials(rest)}
        size={'small-plus'}
        textId={name}
      />
      <div className={styles['recipient-ident-status']}>
        <Identity name={name} details={instance} />
      </div>
    </div>
  )
}

export const RecipientPlusX = ({ extraRecipients }, { t }) => (
  <div className={styles['recipient']}>
    <AvatarPlusX
      extraRecipients={extraRecipients.map(recipient =>
        Contact.getDisplayName(recipient)
      )}
    />
    <div className={styles['recipient-ident-status']}>
      <Identity
        name={t('Share.members.otherContacts', extraRecipients.length)}
      />
    </div>
  </div>
)

RecipientPlusX.contextTypes = {
  t: PropTypes.func.isRequired
}
