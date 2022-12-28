import React, { useState, useMemo, useCallback } from 'react'
import Autosuggest from 'react-autosuggest'
import debounce from 'lodash/debounce'
import cx from 'classnames'

import { useClient, models } from 'cozy-client'

import {
  highlightQueryTerms,
  indexFiles
} from 'drive/web/modules/search/components/helpers'
import styles from 'drive/web/modules/search/components/styles.styl'
import BarSearchInputGroup from 'drive/web/modules/search/components/BarSearchInputGroup'

const SUGGESTIONS_PER_SOURCE = 10

const BarSearchAutosuggest = ({ t }) => {
  const client = useClient()

  const [searching, setSearching] = useState(false)
  const [focused, setFocused] = useState(false)
  const [query, setQuery] = useState(null)
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [fuzzy, setFuzzy] = useState(null)

  const theme = useMemo(
    () => ({
      container: cx(
        styles['coz-searchbar-autosuggest-container'],
        searching ? styles['--searching'] : '',
        focused ? styles['--focused'] : ''
      ),
      input: styles['coz-searchbar-autosuggest-input'],
      inputFocused: styles['coz-searchbar-autosuggest-input-focused'],
      suggestionsContainer:
        styles['coz-searchbar-autosuggest-suggestions-container'],
      suggestionsContainerOpen:
        styles['coz-searchbar-autosuggest-suggestions-container--open'],
      suggestionsList: styles['coz-searchbar-autosuggest-suggestions-list'],
      suggestion: styles['coz-searchbar-autosuggest-suggestion'],
      suggestionHighlighted:
        styles['coz-searchbar-autosuggest-suggestion-highlighted'],
      sectionTitle: styles['coz-searchbar-autosuggest-section-title']
    }),
    [searching, focused]
  )

  const debouncedOnSuggestionsFetchRequested = debounce(
    value => onSuggestionsFetchRequested(value),
    250
  )

  const onSuggestionsFetchRequested = useCallback(
    async ({ value }) => {
      setQuery(value)
      setSearching(true)
      let currentFuzzy = fuzzy
      if (currentFuzzy == null) {
        currentFuzzy = await indexFiles(client)
        setFuzzy(currentFuzzy)
      }

      const suggestions = currentFuzzy.search(value).map(result => ({
        id: result.id,
        title: result.name,
        subtitle: result.path,
        term: result.name,
        onSelect: result.onSelect || 'open:' + result.url,
        icon: result.icon
      }))

      setSuggestions(suggestions.slice(0, SUGGESTIONS_PER_SOURCE))
      setSearching(false)
    },
    [client, fuzzy]
  )

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
    debouncedOnSuggestionsFetchRequested.cancel()
    setQuery(null)
    setSearching(false)
  }

  const onSuggestionSelected = async (event, { suggestion }) => {
    // `onSelect` is a string that describes what should happen when the suggestion is selected. Currently, the only format we're supporting is `open:http://example.com` to change the url of the current page.
    const onSelect = suggestion.onSelect

    if (/^id_note:/.test(onSelect)) {
      const url = await models.note.fetchURL(client, {
        id: onSelect.substr(8)
      })
      window.location.href = url
    } else if (/^open:/.test(onSelect)) {
      window.location.href = onSelect.substr(5)
    } else {
      // eslint-disable-next-line no-console
      console.log(
        'suggestion onSelect (' + onSelect + ') could not be executed'
      )
    }

    setInput('')
    setQuery(null)
  }

  // We want the user to find folders in which he can then navigate into, so we return the path here
  const getSuggestionValue = suggestion => suggestion.subtitle

  const renderSuggestion = suggestion => {
    return (
      <div className={styles['coz-searchbar-autosuggest-suggestion-item']}>
        {suggestion.icon && (
          <img
            className={styles['coz-searchbar-autosuggest-suggestion-icon']}
            src={suggestion.icon}
            alt="icon"
          />
        )}
        <div className={styles['coz-searchbar-autosuggest-suggestion-content']}>
          <div className={styles['coz-searchbar-autosuggest-suggestion-title']}>
            {highlightQueryTerms(suggestion.title, query)}
          </div>
          {suggestion.subtitle && (
            <div
              className={
                styles['coz-searchbar-autosuggest-suggestion-subtitle']
              }
            >
              {highlightQueryTerms(suggestion.subtitle, query)}
            </div>
          )}
        </div>
      </div>
    )
  }

  const inputProps = {
    placeholder: t('searchbar.placeholder'),
    value: input,
    onChange: (event, { newValue }) => {
      setInput(newValue)
    },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }

  const renderInputComponent = inputProps => (
    <BarSearchInputGroup isBusy={searching} isFocus={focused}>
      <input {...inputProps} />
    </BarSearchInputGroup>
  )

  const isInitialSearch = input !== '' && query === null
  const hasSuggestions = suggestions.length > 0

  return (
    <div className={styles['bar-search-container']} role="search">
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={debouncedOnSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        inputProps={inputProps}
        focusInputOnSuggestionClick={false}
      />
      {input !== '' && !isInitialSearch && focused && !hasSuggestions && (
        <div className={styles['coz-searchbar-autosuggest-status-container']}>
          {t('searchbar.empty', { query: input })}
        </div>
      )}
    </div>
  )
}

export default BarSearchAutosuggest
