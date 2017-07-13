import autosuggestTheme from './autosuggest.styl'

import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'
import { getContacts } from './index'

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
    if (contact.email.length === 0) return ''

    let primary = contact.email.find(email => email.primary)
    return primary ? primary.address : contact.email[0].address
  }

  getPrimaryCozyUrl (contact) {
    if (!contact.cozy || contact.cozy.length === 0) return ''

    let primary = contact.cozy.find(cozy => cozy.primary)
    return primary ? primary.url : contact.cozy[0].url
  }

  computeSuggestions (value) {
    const inputValue = value.trim().toLowerCase()
    const inputLength = inputValue.length

    return inputLength === 0 ? [] : this.state.contacts.filter(contact => {
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
