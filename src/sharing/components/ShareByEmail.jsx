import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import get from 'lodash/get'

import { Button, Icon } from 'cozy-ui/react'
import Alerter from 'cozy-ui/react/Alerter'
import SelectBox, { components } from 'cozy-ui/react/SelectBox'
import palette from 'cozy-ui/react/palette'

import { Contact, Group } from 'models'
import { contactsResponseType, groupsResponseType } from 'sharing/propTypes'
import ShareRecipientsInput from 'sharing/components/ShareRecipientsInput'
import styles from 'sharing/share.styl'

const DropdownIndicator = props => (
  <components.DropdownIndicator {...props}>
    <Icon icon="bottom" color={palette.coolGrey} />
  </components.DropdownIndicator>
)
const Option = props => (
  <components.Option {...props}>
    <div className={cx(styles['select-option'])}>
      {props.isSelected && (
        <Icon icon="check-circleless" color={palette.dodgerBlue} />
      )}
      <div>
        <div className={styles['select-option-label']}>{props.label}</div>
        <div className={styles['select-option-desc']}>{props.data.desc}</div>
      </div>
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
    loading: false
  }

  state = { ...this.initialState }

  reset = () => {
    this.setState({ ...this.initialState })
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
    let contactsToAdd
    if (recipient._type === Group.doctype) {
      const groupId = recipient.id
      contactsToAdd = this.props.contacts.data.filter(contact => {
        const contactGroupIds = get(
          contact,
          'relationships.groups.data',
          []
        ).map(group => group._id)

        return contactGroupIds.includes(groupId)
      })
    } else {
      contactsToAdd = [recipient]
    }

    const filtered = contactsToAdd
      .filter(
        contact =>
          (contact.email && contact.email.length > 0) ||
          (contact.cozy && contact.cozy.length > 0)
      )
      .filter(contact => !this.state.recipients.find(r => r === contact))

    this.setState(state => ({
      ...state,
      recipients: [...state.recipients, ...filtered]
    }))
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
            : createContact({
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
              ? Contact.getPrimaryEmail(recipients[0])
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
    const { contacts, documentType, groups } = this.props
    const { recipients } = this.state

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
            groups={groups}
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
            disabled={recipients.length === 0}
          />
        </div>
      </div>
    )
  }
}

ShareByEmail.propTypes = {
  contacts: contactsResponseType.isRequired,
  groups: groupsResponseType.isRequired,
  document: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  sharingDesc: PropTypes.string.isRequired,
  onShare: PropTypes.func.isRequired,
  createContact: PropTypes.func.isRequired
}

export default ShareByEmail
