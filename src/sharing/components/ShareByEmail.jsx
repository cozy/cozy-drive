import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import ReactTooltip from 'react-tooltip'

import { Button } from 'cozy-ui/react'
import Alerter from 'cozy-ui/react/Alerter'
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
  <div
    data-tip={props.locked && props.tipText}
    className={classnames(
      styles['select-wrapper'],
      props.locked ? styles['select-wrapper--locked'] : ''
    )}
  >
    <ReactTooltip
      place="bottom"
      type="light"
      effect="solid"
      event="mouseenter click"
      eventOff="mouseleave"
      className={styles['tooltip']}
    />
    <select
      name="select"
      value={props.value}
      onChange={e => {
        props.onChange(e.target.value)
      }}
      disabled={props.locked}
    >
      {props.options.map(option => (
        <option value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)

ShareTypeSelect.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  locked: PropTypes.bool,
  tipText: PropTypes.string
}

ShareTypeSelect.defaultProps = {
  onChange: console.log,
  value: '',
  locked: false
}

const ShareSubmit = props => (
  <Button
    onClick={e => {
      props.onSubmit()
    }}
    busy={props.loading}
    label={props.label}
  />
)

ShareSubmit.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string,
  loading: PropTypes.bool
}

ShareSubmit.defaultProps = {
  label: 'Submit',
  loading: false
}

class ShareByEmail extends Component {
  sharingTypes = [
    {
      value: 'one-way',
      label: this.context.t('Share.type.one-way'),
      disabled: false
    },
    {
      value: 'two-way',
      label: this.context.t('Share.type.two-way'),
      disabled: false
    }
  ]

  initialState = {
    recipients: [],
    sharingType: 'two-way',
    loading: false
  }

  state = { ...this.initialState }

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

  share = () => {
    const {
      document,
      documentType,
      sharingDesc,
      onShare,
      createContact
    } = this.props
    const { recipients, sharingType } = this.state
    if (recipients.length === 0) {
      return
    }
    this.setState(state => ({ ...state, loading: true }))
    Promise.all(
      recipients.map(
        recipient =>
          recipient.id
            ? recipient
            : createContact('io.cozy.contacts', {
                email: [{ address: recipient.email, primary: true }]
              }).then(resp => resp.data)
      )
    )
      .then(recipients =>
        onShare(document, recipients, sharingType, sharingDesc)
      )
      .then(() => {
        if (recipients.length === 1) {
          Alerter.success(`${documentType}.share.shareByEmail.success`, {
            email: recipients[0].id
              ? getPrimaryEmail(recipients[0])
              : recipients[0].email
          })
        } else {
          Alerter.success(`${documentType}.share.shareByEmail.genericSuccess`, {
            count: recipients.length
          })
        }
        this.reset()
      })
      .catch(err => {
        Alerter.error('Error.generic')
        this.reset()
        throw err
      })
  }

  render() {
    const { t } = this.context
    const {
      contacts,
      documentType,
      document,
      locked,
      hasSharedParent,
      hasSharedChild
    } = this.props

    if (hasSharedParent || hasSharedChild) {
      return (
        <div className={styles['share-byemail-onlybylink']}>
          {t(`${documentType}.share.shareByEmail.onlyByLink`, {
            type: document.type === 'directory' ? 'folder' : 'file'
          })}{' '}
          <strong>
            {t(
              `${documentType}.share.shareByEmail.${
                hasSharedParent ? 'hasSharedParent' : 'hasSharedChild'
              }`
            )}
          </strong>
        </div>
      )
    }

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
        <div className={styles['share-type-control']}>
          <ShareTypeSelect
            options={this.sharingTypes}
            value={this.state.sharingType}
            onChange={this.onChange}
            locked={locked}
            tipText={t(
              document.type === 'directory'
                ? 'Share.locked-type-folder'
                : 'Share.locked-type-file'
            )}
          />
          <ShareSubmit
            label={t(`${documentType}.share.shareByEmail.send`)}
            onSubmit={this.share}
            loading={this.state.loading}
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
  locked: PropTypes.bool,
  onShare: PropTypes.func.isRequired,
  createContact: PropTypes.func.isRequired,
  hasSharedParent: PropTypes.bool,
  hasSharedChild: PropTypes.bool
}

ShareByEmail.defaultProps = {
  contacts: [],
  locked: false
}

export default ShareByEmail
