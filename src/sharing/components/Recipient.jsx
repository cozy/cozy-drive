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

import { getDisplayName, getPrimaryEmail, getPrimaryCozy } from '..'

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
            .map(recipient => getDisplayName(recipient))}
          size={size}
        />
      )}
      {reversedRecipients.slice(0, MAX_DISPLAYED_RECIPIENTS).map(recipient => (
        <Avatar
          key={`key_avatar_${recipient.email}`}
          text={getInitiales(getDisplayName(recipient))}
          size={size}
          textId={getDisplayName(recipient)}
        />
      ))}
    </div>
  )
}

const Identity = ({ name, url = '-' }) => (
  <div className={classNames(styles['recipient-idents'], 'u-ml-1')}>
    <div className={styles['recipient-user']}>{name}</div>
    <div className={styles['recipient-url']}>{url}</div>
  </div>
)

export const UserAvatar = ({ url, size, ...rest }) => (
  <div className={styles['avatar']}>
    <Avatar
      text={getInitiales(getDisplayName(rest))}
      size={size}
      textId={getDisplayName(rest)}
    />
    <Identity name={getDisplayName(rest)} url={url} />
  </div>
)

class Status extends Component {
  state = {
    revoking: false
  }
  static contextTypes = {
    t: PropTypes.func.isRequired,
    client: PropTypes.func.isRequired
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

const Recipient = (props, { t, client }) => {
  const { instance, isOwner, status, ...rest } = props
  const isMe =
    (isOwner && status === 'owner') || instance === client.options.uri
  const name = getDisplayName(rest)
  return (
    <div className={classNames(styles['recipient'], 'u-mt-1')}>
      <Avatar text={getInitiales(name)} size={'small-plus'} textId={name} />
      <div className={styles['recipient-ident-status']}>
        <Identity
          name={isMe ? t('Share.recipients.you') : name}
          url={instance}
        />
        <StatusWithBreakpoints {...props} name={name} />
      </div>
    </div>
  )
}

export default Recipient

export const RecipientWithoutStatus = ({ instance, ...rest }) => {
  const name = getDisplayName(rest)
  return (
    <div className={styles['recipient']}>
      <Avatar text={getInitiales(name)} size={'small-plus'} textId={name} />
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

export const ContactSuggestion = ({ contact }) => {
  const name = getPrimaryEmail(contact)
  const url = getPrimaryCozy(contact)
  return (
    <div className={styles['recipient']}>
      <Avatar text={getInitiales(name)} size={'small'} textId={name} />
      <Identity name={name} url={url} />
    </div>
  )
}

const getInitiales = name => {
  return name.charAt(0).toUpperCase()
}
