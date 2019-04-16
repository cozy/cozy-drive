import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'

import { Contact, Group } from 'cozy-doctypes'
import { Icon, Spinner } from 'cozy-ui/react'
import palette from 'cozy-ui/react/palette'

import styles from 'sharing/components/autosuggest.styl'
import BoldCross from 'sharing/assets/icons/icon-cross-bold.svg'

import ContactSuggestion from 'sharing/components/ContactSuggestion'

// TODO: sadly we have different versions of contacts' doctype to handle...
// A migration tool on the stack side is needed here
const emailMatch = (input, contact) => {
  if (!contact.email) return false
  const emailInput = new RegExp(input)
  if (Array.isArray(contact.email)) {
    return contact.email.some(email => emailInput.test(email.address))
  }
  return emailInput.test(contact.email)
}

const cozyUrlMatch = (input, contact) => {
  if (!contact.cozy || !contact.url) return false
  const urlInput = new RegExp(input)
  if (contact.cozy && Array.isArray(contact.cozy)) {
    return contact.cozy.some(cozy => urlInput.test(cozy.url))
  }
  return urlInput.test(contact.url)
}

const groupNameMatch = (input, contactOrGroup) => {
  if (contactOrGroup._type !== Group.doctype) return false
  const nameInput = new RegExp(input, 'i')
  return nameInput.test(contactOrGroup.name)
}

export default class ShareAutocomplete extends Component {
  state = {
    inputValue: '',
    suggestions: []
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.contactsAndGroups.length !== prevProps.contactsAndGroups.length
    ) {
      this.onSuggestionsFetchRequested({
        value: this.state.inputValue
      })
    }
  }

  computeSuggestions(value) {
    const inputValue = value.trim().toLowerCase()
    return inputValue.length === 0
      ? []
      : this.props.contactsAndGroups.filter(
          contactOrGroup =>
            groupNameMatch(inputValue, contactOrGroup) ||
            emailMatch(inputValue, contactOrGroup) ||
            cozyUrlMatch(inputValue, contactOrGroup)
        )
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState(state => ({
      ...state,
      suggestions: this.computeSuggestions(value)
    }))
  }

  onSuggestionsClearRequested = () => {
    this.setState(state => ({ ...state, suggestions: [] }))
  }

  onChange = (event, { newValue, method }) => {
    if (typeof newValue !== 'object') {
      this.setState(state => ({ ...state, inputValue: newValue }))
    } else if (method === 'click' || method === 'enter') {
      // A suggestion has been picked
      this.onPick(newValue)
    }
  }

  onKeyPress = event => {
    // The user wants to add an unknown email
    if (
      ((event.key === 'Enter' || event.keyCode === 13) &&
        this.state.inputValue !== '') ||
      ((event.key === 'Space' || event.keyCode === 32) &&
        /^.+@.+/.test(this.state.inputValue))
    ) {
      this.onPick({ email: this.state.inputValue })
    }
  }

  onFocus = () => {
    this.props.onFocus()
  }

  onBlur = (event, { highlightedSuggestion }) => {
    if (highlightedSuggestion) {
      this.props.onPick(highlightedSuggestion)
      this.setState(state => ({ ...state, inputValue: '' }))
    } else if (
      this.state.inputValue !== '' &&
      this.state.inputValue.match(/\S+@\S+/)
    ) {
      this.props.onPick({ email: this.state.inputValue })
      this.setState(state => ({ ...state, inputValue: '' }))
    }
  }

  onPick = value => {
    this.props.onPick(value)
    this.setState(state => ({ ...state, inputValue: '' }))
    setTimeout(() => this.input.focus(), 1) // don't ask...
  }

  onRemove = value => {
    this.props.onRemove(value)
    setTimeout(() => this.input.focus(), 1)
  }

  renderInput(inputProps) {
    const { loading, recipients } = this.props
    return (
      <div className={styles['recipientsContainer']}>
        {recipients.map((recipient, idx) => {
          const recipientEmail = recipient.id
            ? Contact.getPrimaryEmail(recipient)
            : recipient.email

          const value = recipientEmail || recipient.fullname
          return (
            <div
              className={styles['recipientChip']}
              key={`key_recipient_${idx}`}
            >
              <span>{value}</span>
              <button
                className={styles['removeRecipient']}
                onClick={() => this.onRemove(recipient)}
              >
                <Icon icon={BoldCross} width="16" height="16" />
              </button>
            </div>
          )
        })}
        <input {...inputProps} onKeyPress={this.onKeyPress} />
        {loading && (
          <Spinner
            color={palette.dodgerBlue}
            className="u-flex u-flex-items-center"
          />
        )}
      </div>
    )
  }

  render() {
    const { inputValue, suggestions } = this.state
    const { contactsAndGroups, placeholder } = this.props
    return (
      <Autosuggest
        ref={self => {
          this.input = self ? self.input : null
        }}
        theme={styles}
        suggestions={suggestions.slice(0, 20)}
        getSuggestionValue={contact => contact}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        renderSuggestion={contactOrGroup => (
          <ContactSuggestion
            contacts={contactsAndGroups.filter(
              item => item._type === Contact.doctype
            )}
            contactOrGroup={contactOrGroup}
          />
        )}
        renderInputComponent={props => this.renderInput(props)}
        highlightFirstSuggestion
        inputProps={{
          onFocus: this.onFocus,
          onChange: this.onChange,
          onBlur: this.onBlur,
          value: inputValue,
          type: 'email',
          placeholder
        }}
      />
    )
  }
}
