import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { Button } from 'cozy-ui/react'
import Alerter from 'photos/components/Alerter'
import ShareAutosuggest from './ShareAutosuggest'
import { getPrimaryEmail } from '..'

import styles from '../share.styl'

const ShareRecipientsInput = props => (
  <div>
    <label className={styles['coz-form-label']} htmlFor="email">
      {props.label}
    </label>
    <ShareAutosuggest
      contacts={props.contacts}
      recipients={props.recipients}
      onPick={props.onPick}
      onRemove={props.onRemove}
    />
  </div>
)

ShareRecipientsInput.propTypes = {
  label: PropTypes.string,
  contacts: PropTypes.array,
  recipients: PropTypes.array,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
}

ShareRecipientsInput.defaultProps = {
  label: 'To:',
  contacts: [],
  recipients: []
}

const ShareTypeSelect = props => (
  <select
    name="select"
    className={styles['coz-select']}
    value={props.value}
    onChange={e => {
      props.onChange(e.target.value)
    }}
  >
    {props.options.map(option => (
      <option value={option.value} disabled={option.disabled}>
        {option.label}
      </option>
    ))}
  </select>
)

ShareTypeSelect.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.string
}

ShareTypeSelect.defaultProps = {
  onChange: console.log,
  value: ''
}

const ShareSubmit = props => (
  <Button
    onClick={e => {
      props.onSubmit()
    }}
  >
    {props.label}
  </Button>
)

ShareSubmit.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string
}

ShareSubmit.defaultProps = {
  label: 'Submit'
}

class ShareByEmail extends Component {
  sharingTypes = [
    {
      value: 'one-way',
      label: this.context.t('Share.type.one-way'),
      disabled: true
    },
    {
      value: 'two-way',
      label: this.context.t('Share.type.two-way'),
      disabled: false
    }
  ]

  initialState = {
    recipients: [],
    sharingType: 'two-way'
  }

  state = { ...this.initialState }

  sendSharingLink = () => {
    const { recipients, sharingType } = this.state
    if (recipients.length === 0) {
      return
    }
    this.share(recipients, sharingType)
    this.reset()
  }

  reset = () => {
    this.setState(state => ({ ...this.initialState }))
  }

  onChange = value => {
    this.setState(state => ({ ...state, sharingType: value }))
  }

  onSubmit = () => {
    this.sendSharingLink()
  }

  onRecipientPick = recipient => {
    const existing = this.state.recipients.find(r => r === recipient)
    if (!existing) {
      this.setState(state => ({
        ...state,
        recipients: [...state.recipients, recipient]
      }))
    }
  }

  onRecipientRemove = recipient => {
    const idx = this.state.recipients.findIndex(r => r === recipient)
    this.setState(state => ({
      ...state,
      recipients: [
        ...state.recipients.slice(0, idx),
        ...state.recipients.slice(idx + 1)
      ]
    }))
  }

  share = (recipients, sharingType) => {
    const { document, documentType, sharingDesc, onShare } = this.props
    onShare(document, recipients, sharingType, sharingDesc)
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

  render() {
    const { t } = this.context
    const { contacts, documentType } = this.props
    const { recipients } = this.state

    return (
      <div className={styles['coz-form-group']}>
        <div className={styles['coz-form']}>
          <ShareRecipientsInput
            label={t(`${documentType}.share.shareByEmail.email`)}
            onPick={recipient => this.onRecipientPick(recipient)}
            onRemove={recipient => this.onRecipientRemove(recipient)}
            contacts={contacts}
            recipients={recipients}
          />
        </div>
        <div
          className={classnames(
            styles['coz-form-controls'],
            styles['coz-form-controls--dispatch']
          )}
        >
          <ShareTypeSelect
            options={this.sharingTypes}
            value={this.state.sharingType}
            onChange={this.onChange}
          />
          <ShareSubmit
            label={t(`${documentType}.share.shareByEmail.send`)}
            onSubmit={this.sendSharingLink}
          />
        </div>
      </div>
    )
  }
}

ShareByEmail.propTypes = {
  contacts: PropTypes.array,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  sharingDesc: PropTypes.string.isRequired,
  onShare: PropTypes.func.isRequired
}

ShareByEmail.defaultProps = {
  contacts: []
}

export default ShareByEmail
