import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'

import styles from './autosuggest.styl'
import Recipient from './Recipient'

import { getPrimaryEmail } from '..'

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
            (contact.email &&
              contact.email.some(email =>
                new RegExp(inputValue).test(email.address)
              )) ||
            (contact.cozy &&
              contact.cozy.some(cozy => new RegExp(inputValue).test(cozy.url)))
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
    // A suggestion has been picked
    if (typeof newValue === 'object') {
      this.onPick(newValue)
    } else {
      this.setState(state => ({ ...state, inputValue: newValue }))
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
      <div className={styles.recipientsContainer}>
        {this.props.recipients.map(recipient => (
          <div className={styles.recipientChip}>
            <span>
              {recipient.id ? getPrimaryEmail(recipient) : recipient.email}
            </span>
            <button
              className={styles.removeRecipient}
              onClick={() => this.onRemove(recipient)}
            />
          </div>
        ))}
        <div>
          <input {...props} onKeyPress={this.onKeyPress} />
        </div>
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
        inputProps={{
          onChange: this.onChange,
          value: inputValue,
          type: 'email'
        }}
      />
    )
  }
}
