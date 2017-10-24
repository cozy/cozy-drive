import styles from './recipient.styl'

import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import Spinner from 'cozy-ui/react/Spinner'
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

class Recipient extends Component {
  state = {
    revoking: false
  }

  onUnshare = () => {
    this.setState({ revoking: true })
    this.props
      .onUnshare(this.props.contact)
      .then(() => this.setState({ revoking: false }))
  }

  render() {
    const { t, contact, status, type, documentType } = this.props
    const { revoking } = this.state
    const name = getPrimaryEmail(contact)
    const url = getPrimaryCozy(contact)
    return (
      <div className={styles['pho-recipient']}>
        <Avatar name={name} />
        <Identity name={name} url={url} />
        <div className={styles['pho-recipient-status']}>
          {revoking && <Spinner />}
          {!revoking &&
            status && (
              <Menu
                title={
                  status === 'accepted' && type
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
                    onClick={this.onUnshare}
                  >
                    {t(`${documentType}.share.unshare.title`)}
                  </a>
                </Item>
              </Menu>
            )}
        </div>
      </div>
    )
  }
}

export default translate()(Recipient)
