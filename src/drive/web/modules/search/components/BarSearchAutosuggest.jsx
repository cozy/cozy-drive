import React, { useState } from 'react'
import Autosuggest from 'react-autosuggest'

import { useClient } from 'cozy-client'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'

import styles from 'drive/web/modules/search/components/styles.styl'
import BarSearchInputGroup from 'drive/web/modules/search/components/BarSearchInputGroup'
import useSearch from 'drive/web/modules/search/hooks/useSearch'
import SuggestionItem from 'drive/web/modules/search/components/SuggestionItem'
import { openOnSelect } from 'drive/web/modules/search/components/helpers'

const BarSearchAutosuggest = ({ t }) => {
  const client = useClient()
  const {
    suggestions,
    fetchSuggestions,
    hasSuggestions,
    clearSuggestions,
    isBusy,
    query,
    makeIndexes
  } = useSearch()

  const [focused, setFocused] = useState(false)
  const [input, setInput] = useState('')

  const theme = {
    container: 'u-w-100',
    suggestionsContainer:
      styles['bar-search-autosuggest-suggestions-container'],
    suggestionsContainerOpen:
      styles['bar-search-autosuggest-suggestions-container--open'],
    suggestionsList: styles['bar-search-autosuggest-suggestions-list']
  }

  const onSuggestionsFetchRequested = ({ value }) => {
    fetchSuggestions(value)
  }
  const onSuggestionsClearRequested = () => {
    clearSuggestions()
  }

  const handleCleanInput = () => {
    clearSuggestions()
    setInput('')
  }

  const onSuggestionSelected = async (event, { suggestion }) => {
    await openOnSelect(client, suggestion.onSelect)
    clearSuggestions()
    setInput('')
  }

  // We want the user to find folders in which he can then navigate into, so we return the path here
  const getSuggestionValue = suggestion => suggestion.subtitle

  const renderSuggestion = suggestion => {
    return <SuggestionItem suggestion={suggestion} query={query} />
  }

  const inputProps = {
    placeholder: t('searchbar.placeholder'),
    value: input,
    onChange: (event, { newValue }) => {
      setInput(newValue)
    },
    onFocus: () => {
      makeIndexes()
      setFocused(true)
    },
    onBlur: () => setFocused(false)
  }

  const renderInputComponent = inputProps => (
    <BarSearchInputGroup
      isBusy={isBusy}
      isFocus={focused}
      isInputNotEmpty={input !== ''}
      onClean={handleCleanInput}
    >
      <input {...inputProps} />
    </BarSearchInputGroup>
  )

  const renderSuggestionsContainer = ({ containerProps, children }) => {
    return <List {...containerProps}>{children}</List>
  }

  const isSearchEmpty = query !== '' && focused && !hasSuggestions && !isBusy

  return (
    <div className={styles['bar-search-container']} role="search">
      <Autosuggest
        theme={theme}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        renderSuggestionsContainer={renderSuggestionsContainer}
        inputProps={inputProps}
        focusInputOnSuggestionClick={false}
      />
      {isSearchEmpty && (
        <div className={styles['bar-search-autosuggest-status-container']}>
          {t('searchbar.empty', { query })}
        </div>
      )}
    </div>
  )
}

export default BarSearchAutosuggest
