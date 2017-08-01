import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import { getContacts } from '..'

import autosuggestTheme from './autosuggest.styl'

export default class ShareAutocomplete extends Component {
  getInitialState () {
    return {
      contacts: [],
      suggestions: []
    }
  }

  componentDidMount () {
    this.fetchContacts()
  }

  async fetchContacts () {
    const contacts = await getContacts()
    this.setState({ contacts })
  }

  getPrimaryEmailAddress (contact) {
    // look for an address marked as primary, fallback to the first one or to an empty string
    if (contact.email.length === 0) return ''

    let primary = contact.email.find(email => email.primary)
    return primary ? primary.address : contact.email[0].address
  }

  getPrimaryCozyUrl (contact) {
    // same thing as getPrimaryEmailAddress
    if (!contact.cozy || contact.cozy.length === 0) return ''

    let primary = contact.cozy.find(cozy => cozy.primary)
    return primary ? primary.url : contact.cozy[0].url
  }

  computeSuggestions (value) {
    // Looks into all email addressses and tries to find one that starts with the current input value.
    // Note that it might find a match on an address taht is not considered primary.
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0 ? [] : this.state.contacts.filter(contact => {
      if (!contact.email) return false
      // technically `email` is supposed to be an array, but we can handle a single value here
      if (contact.email instanceof Array === false) contact.email = [{address: contact.email.toString()}]

      return contact.email.filter(email => (email.address.toLowerCase().slice(0, inputLength) === inputValue)).length > 0
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

  onChange (event, { newValue }) {
    // `newValue` can be a simple string when it's the result of the user typing text, or it can be a contact if it results from an interaction with the autocomplete
    if (typeof newValue === 'string') {
      this.props.onChange(newValue)
    } else {
      this.props.onChange(this.getPrimaryEmailAddress(newValue), this.getPrimaryCozyUrl(newValue))
    }
  }

  render ({ value }, { suggestions }) {
    return (
      <Autosuggest
        theme={autosuggestTheme}
        suggestions={suggestions}
        getSuggestionValue={contact => contact}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested.bind(this)}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested.bind(this)}
        renderSuggestion={contact =>
          <div>
            <div className={autosuggestTheme['suggestionPrimary']}>{this.getPrimaryEmailAddress(contact)}</div>
            <div className={autosuggestTheme['suggestionSecondary']}>{this.getPrimaryCozyUrl(contact)}</div>
          </div>
      }
        inputProps={{
          onChange: this.onChange.bind(this),
          value: value
        }}
      />
    )
  }
}
