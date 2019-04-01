import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'

import { Button, Icon } from 'cozy-ui/react'
import Alerter from 'cozy-ui/react/Alerter'
import SelectBox, { components } from 'cozy-ui/react/SelectBox'
import ShareAutosuggest from './ShareAutosuggest'
import { getPrimaryEmail } from '..'
import { renewAuthorization } from 'drive/mobile/modules/authorization/sagas'
import palette from 'cozy-ui/react/palette'

import styles from '../share.styl'

const ShareRecipientsInput = props => (
  <div>
    <label className={styles['coz-form-label']} htmlFor="email">
      {props.label}
    </label>
    <ShareAutosuggest
      contacts={props.contacts}
      recipients={props.recipients}
      onFocus={props.onFocus}
      onPick={props.onPick}
      onRemove={props.onRemove}
      placeholder={props.placeholder}
    />
  </div>
)

ShareRecipientsInput.propTypes = {
  label: PropTypes.string,
  contacts: PropTypes.array,
  recipients: PropTypes.array,
  onFocus: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  placeholder: PropTypes.string
}

ShareRecipientsInput.defaultProps = {
  label: 'To:',
  contacts: [],
  recipients: []
}

const RequestPermissionPopin = ({ onClose, onAccept }, { t }) => (
  <div className={styles['permission-required-popin']}>
    <Button
      theme="close"
      className={styles['permission-required-popin-close']}
      onClick={onClose}
      extension="narrow"
      iconOnly
      label={t('SelectionBar.close')}
    >
      <Icon icon="cross" width="14" height="14" color="coolGrey" />
    </Button>

    <h4>{t('Share.contacts.permissionRequired.title')}</h4>
    <p>{t('Share.contacts.permissionRequired.desc')}</p>
    <Button
      className={styles['permission-required-popin-accept']}
      label={t('Share.contacts.permissionRequired.action')}
      onClick={onAccept}
    />
  </div>
)

RequestPermissionPopin.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired
}

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <Icon icon="bottom" color={palette.coolGrey} />
  </components.DropdownIndicator>
)
const Option = props => (
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
    backgroundColor: state.isFocused ? palette.paleGrey : null,
    padding: 0,
    borderBottom:
      state.options.findIndex(o => o.value === state.value) === 0
        ? `1px solid ${palette.silver}`
        : null
  }),
  menu: base => ({
    ...base,
    width: '204%'
  })
}
const ShareTypeSelect = ({ options, onChange }) => (
  <div className={styles['select-wrapper']}>
    <SelectBox
      name="select"
      classNamePrefix="needsclick react-select"
      components={{ DropdownIndicator, Option }}
      styles={customStyles}
      defaultValue={options[0]}
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
  // eslint-disable-next-line no-console
  onChange: console.log,
  value: ''
}

const ShareSubmit = props => (
  <Button
    onClick={() => {
      props.onSubmit()
    }}
    busy={props.loading}
    label={props.label}
    disabled={props.disabled}
  />
)

ShareSubmit.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  label: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool
}

ShareSubmit.defaultProps = {
  label: 'Submit',
  loading: false
}

class ShareByEmail extends Component {
  static contextTypes = {
    t: PropTypes.func.isRequired,
        client: PropTypes.object.isRequired
  }
  sharingTypes = [
    {
      value: 'two-way',
      label: this.context.t('Share.type.two-way'),
      desc: this.context.t('Share.type.desc.two-way'),
      disabled: false
    },
    {
      value: 'one-way',
      label: this.context.t('Share.type.one-way'),
      desc: this.context.t('Share.type.desc.one-way'),
      disabled: false
    }
  ]

  initialState = {
    recipients: [],
    sharingType: 'two-way',
    loading: false,
    showPermissionPopin: false,
    hasPopinBeenShowed: false
  }

  state = { ...this.initialState }

  reset = () => {
    this.setState({ ...this.initialState })
  }

  onInputFocus = () => {
    if (
      this.props.needsContactsPermission === true &&
      !this.state.hasPopinBeenShowed
    ) {
      this.setState(state => ({ ...state, showPermissionPopin: true }))
    }
  }

  onChange = value => {
    this.setState(state => ({ ...state, sharingType: value }))
  }

  onSubmit = () => {
    this.sendSharingLink()
  }

  sanitizeRecipient = recipient => {
    const matches = recipient.email.match(/\s(.+@.+)\s/g)
    recipient.email = matches.length
      ? matches[0]
          .trim()
          .replace(/\s.+/g, '')
          .replace(/^[\W]|[\W]$/g, '')
      : recipient.email
    return recipient
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

  closePermissionPopin = () => {
    this.setState(state => ({
      ...state,
      showPermissionPopin: false,
      hasPopinBeenShowed: true
    }))
  }

  onPermissionRequire = async () => {
    try {
      await this.props.renewAuthorization(this.context.client)
      this.closePermissionPopin()
      Alerter.success('Share.contacts.permissionRequired.success')
    } catch (e) {
      Alerter.error('Error.generic')
    }
  }

  render() {
    const { t } = this.context
    const { contacts, documentType } = this.props
    const { recipients, showPermissionPopin } = this.state

    return (
      <div className={styles['coz-form-group']}>
        <div className={styles['coz-form']}>
          <ShareRecipientsInput
            label={t(`${documentType}.share.shareByEmail.email`)}
            placeholder={
              recipients.length === 0
                ? t(`${documentType}.share.shareByEmail.emailPlaceholder`)
                : ''
            }
            onFocus={this.onInputFocus}
            onPick={recipient => this.onRecipientPick(recipient)}
            onRemove={recipient => this.onRecipientRemove(recipient)}
            contacts={contacts}
            recipients={recipients}
          />
        </div>
        {showPermissionPopin && (
          <RequestPermissionPopin
            onClose={this.closePermissionPopin}
            onAccept={this.onPermissionRequire}
          />
        )}
        <div className={styles['share-type-control']}>
          <ShareTypeSelect
            options={this.sharingTypes}
            onChange={this.onChange}
          />
          <ShareSubmit
            label={t(`${documentType}.share.shareByEmail.send`)}
            onSubmit={this.share}
            loading={this.state.loading}
            disabled={recipients.length === 0}
          />
        </div>
      </div>
    )
  }
}

ShareByEmail.propTypes = {
  contacts: PropTypes.array,
  document: PropTypes.func.isRequired,
  documentType: PropTypes.string.isRequired,
  sharingDesc: PropTypes.string.isRequired,
  onShare: PropTypes.func.isRequired,
  createContact: PropTypes.func.isRequired,
  needsContactsPermission: PropTypes.bool,
  renewAuthorization: PropTypes.func.isRequired
}

ShareByEmail.defaultProps = {
  contacts: []
}

export default connect(
  null,
  dispatch => ({
    renewAuthorization: client => dispatch(renewAuthorization(client))
  })
)(ShareByEmail)
