import autosuggestTheme from './autosuggest.styl'

import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import { getContacts } from './index'

export default class ShareAutocomplete extends Component {
  getInitialState () {
    return {
      contacts: [],
      suggestions: [],
    }
  }

  componentDidMount () {
    this.fetchContacts()
  }

  async fetchContacts () {
    const contacts = await getContacts()
    this.setState({ contacts })
  }

  computeSuggestions (value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : this.state.contacts.filter(contact => {
      return contact.email[0].address.toLowerCase().slice(0, inputLength) === inputValue
    })
  }

  onSuggestionsFetchRequested ({ value }) {
    this.setState({
      suggestions: this.computeSuggestions(value)
    })
  }

  onSuggestionsClearRequested () {
    this.setState({
      suggestions: []
    })
  }

  render ({ onChange, value }, { suggestions }) {
    return (
    <Autosuggest
      theme={autosuggestTheme}
      suggestions={suggestions}
      getSuggestionValue={contact => contact}
      onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
      onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
      renderSuggestion={contact =>
        <div>
          <div className={autosuggestTheme['suggestion-primary']}>{contact.email[0].address}</div>
          <div className={autosuggestTheme['suggestion-secondary']}>{contact.cozy[0].url}</div>
        </div>
      }
      inputProps={{
        onChange: onChange,
        value: value
      }}
      />
  )}
}
