import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'

import styles from './autosuggest.styl'
import Recipient from './Recipient'
import { Icon } from 'cozy-ui/react'

import { getPrimaryEmail } from '..'

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

export default class ShareAutocomplete extends Component {
  state = {
    inputValue: '',
    suggestions: []
  }

  computeSuggestions(value) {
    const inputValue = value.trim().toLowerCase()
    return inputValue.length === 0
      ? []
      : this.props.contacts.filter(
          contact =>
            emailMatch(inputValue, contact) || cozyUrlMatch(inputValue, contact)
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
      (event.key === 'Enter' || event.keyCode === 13) &&
      this.state.inputValue !== ''
    ) {
      this.onPick({ email: this.state.inputValue })
    }
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

  renderInput(props) {
    return (
      <div className={styles['recipientsContainer']}>
        {this.props.recipients.map(recipient => (
          <div className={styles['recipientChip']}>
            <span>
              {recipient.id ? getPrimaryEmail(recipient) : recipient.email}
            </span>
            <button
              className={styles['removeRecipient']}
              onClick={() => this.onRemove(recipient)}
            >
              <Icon icon="cross" width="16" height="16" />
            </button>
          </div>
        ))}
        <input {...props} onKeyPress={this.onKeyPress} />
      </div>
    )
  }

  render() {
    const { inputValue, suggestions } = this.state
    return (
      <Autosuggest
        ref={self => {
          this.input = self ? self.input : null
        }}
        theme={styles}
        suggestions={suggestions}
        getSuggestionValue={contact => contact}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        renderSuggestion={contact => <Recipient contact={contact} />}
        renderInputComponent={props => this.renderInput(props)}
        highlightFirstSuggestion
        inputProps={{
          onChange: this.onChange,
          onBlur: this.onBlur,
          value: inputValue,
          type: 'email'
        }}
      />
    )
  }
}
