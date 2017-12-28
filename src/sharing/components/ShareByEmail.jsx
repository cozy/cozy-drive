import React from 'react'
import classnames from 'classnames'
import { Button } from 'cozy-ui/react'

import Alerter from 'photos/components/Alerter'
import ShareAutocomplete from './ShareAutocomplete'
import WhoHasAccess from './WhoHasAccess'
import { getPrimaryEmail } from '..'

import styles from '../share.styl'

class ShareByEmailWrapper extends React.Component {
  share(recipients, sharingType) {
    const { document, documentType, sharingDesc } = this.props
    this.props
      .onShare(document, recipients, sharingType, sharingDesc)
      .then(() => {
        if (recipients.length === 1) {
          Alerter.info(`${documentType}.share.shareByEmail.success`, {
            email: recipients[0].id
              ? getPrimaryEmail(recipients[0])
              : recipients[0].email
          })
        } else {
          Alerter.info(`${documentType}.share.shareByEmail.genericSuccess`, {
            count: recipients.length
          })
        }
      })
      .catch(err => {
        Alerter.error('Error.generic')
        throw err
      })
  }

  unshare(recipient) {
    const { document, documentType } = this.props
    this.props
      .onUnshare(document, recipient)
      .then(() => {
        Alerter.info(`${documentType}.share.unshare.success`, {
          email: getPrimaryEmail(recipient)
        })
      })
      .catch(err => {
        Alerter.error('Error.generic')
        throw err
      })
  }

  render() {
    const { document, documentType, contacts, recipients } = this.props
    return (
      <div>
        <ShareByEmail
          onSend={(recipient, sharingType) =>
            this.share(recipient, sharingType)
          }
          contacts={contacts}
          documentType={documentType}
        />
        <WhoHasAccess
          document={document}
          documentType={documentType}
          recipients={recipients}
          onUnshare={recipient => this.unshare(recipient)}
        />
      </div>
    )
  }
}

export default ShareByEmailWrapper

class ShareByEmail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipients: [],
      sharingType: 'two-way'
    }
  }

  onRecipientPick(recipient) {
    const existing = this.state.recipients.find(r => r === recipient)
    if (!existing) {
      this.setState(state => ({
        ...state,
        recipients: [...state.recipients, recipient]
      }))
    }
  }

  onRecipientRemove(recipient) {
    const idx = this.state.recipients.findIndex(r => r === recipient)
    this.setState(state => ({
      ...state,
      recipients: [
        ...state.recipients.slice(0, idx),
        ...state.recipients.slice(idx + 1)
      ]
    }))
  }

  reset() {
    this.setState(state => ({
      ...state,
      recipients: [],
      sharingType: 'two-way'
    }))
  }

  sendSharingLink() {
    const { recipients, sharingType } = this.state
    if (recipients.length === 0) {
      return
    }
    this.props.onSend(recipients, sharingType)
    this.reset()
  }

  changeSharingType(sharingType) {
    this.setState(state => ({ ...state, sharingType }))
  }

  render() {
    const { t } = this.context
    const { contacts, documentType } = this.props
    const { recipients } = this.state
    return (
      <div className={styles['coz-form-group']}>
        <div className={styles['coz-form']}>
          <label className={styles['coz-form-label']} htmlFor="email">
            {t(`${documentType}.share.shareByEmail.email`)}
          </label>
          <ShareAutocomplete
            contacts={contacts}
            recipients={recipients}
            onPick={recipient => this.onRecipientPick(recipient)}
            onRemove={recipient => this.onRecipientRemove(recipient)}
          />
        </div>
        <div
          className={classnames(
            styles['coz-form-controls'],
            styles['coz-form-controls--dispatch']
          )}
        >
          <select
            name="select"
            className={styles['coz-select']}
            value={this.state.sharingType}
            onChange={e => this.changeSharingType(e.target.value)}
          >
            <option value="one-way">{t('Share.type.one-way')}</option>
            <option value="two-way">{t('Share.type.two-way')}</option>
          </select>
          <Button
            onClick={e => {
              this.sendSharingLink()
            }}
          >
            {t(`${documentType}.share.shareByEmail.send`)}
          </Button>
        </div>
      </div>
    )
  }
}
