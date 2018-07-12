import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Button, Icon } from 'cozy-ui/react'
import Alerter from 'cozy-ui/react/Alerter'
import SelectBox, { components } from 'cozy-ui/react/SelectBox'
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

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <Icon icon="bottom" color="#95999d" />
  </components.DropdownIndicator>
)
const Option = (props, { t }) => (
  <components.Option {...props}>
    <div
      className={cx(styles['select-option'], {
        [styles['select-option--selected']]: props.isSelected
      })}
    >
      <div className={styles['select-option-label']}>{props.label}</div>
      <div className={styles['select-option-desc']}>{props.data.desc}</div>
    </div>
  </components.Option>
)
const customStyles = {
  option: (base, state) => ({
    ...base,
    color: 'black',
    backgroundColor: state.isFocused ? '#f5f6f7' : null,
    padding: 0,
    borderBottom:
      state.options.findIndex(o => o.value === state.value) === 0
        ? '1px solid #c4c5c7'
        : null
  }),
  menu: (base, state) => ({
    ...base,
    width: '204%'
  })
}
const ShareTypeSelect = ({ options, onChange }) => (
  <div className={styles['select-wrapper']}>
    <SelectBox
      name="select"
      classNamePrefix="react-select"
      components={{ DropdownIndicator, Option }}
      styles={customStyles}
      defaultValue={options[1]}
      isSearchable={false}
      onChange={option => {
        onChange(option.value)
      }}
      options={options}
    />
  </div>
)

ShareTypeSelect.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired
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
      desc: this.context.t('Share.type.desc.one-way'),
      disabled: false
    },
    {
      value: 'two-way',
      label: this.context.t('Share.type.two-way'),
      desc: this.context.t('Share.type.desc.two-way'),
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
      hasSharedParent,
      hasSharedChild
    } = this.props

    if (hasSharedParent || hasSharedChild) {
      return (
        <div className={styles['share-byemail-onlybylink']}>
          {t(`${documentType}.share.shareByEmail.onlyByLink`, {
            type: t(
              `${documentType}.share.shareByEmail.type.${
                document.type === 'directory' ? 'folder' : 'file'
              }`
            )
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
            onChange={this.onChange}
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
  onShare: PropTypes.func.isRequired,
  createContact: PropTypes.func.isRequired,
  hasSharedParent: PropTypes.bool,
  hasSharedChild: PropTypes.bool
}

ShareByEmail.defaultProps = {
  contacts: []
}

export default ShareByEmail
