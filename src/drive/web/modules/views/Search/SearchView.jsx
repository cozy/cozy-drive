import React, { useState, useCallback } from 'react'
import cx from 'classnames'

import { useClient } from 'cozy-client'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Input from 'cozy-ui/transpiled/react/Input'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import BackButton from 'components/Button/BackButton'

import { BarLeft, BarSearch } from 'components/Bar'
import { openOnSelect } from 'drive/web/modules/search/components/helpers'
import useSearch from 'drive/web/modules/search/hooks/useSearch'
import SuggestionItem from 'drive/web/modules/search/components/SuggestionItem'
import BarSearchInputGroup from 'drive/web/modules/search/components/BarSearchInputGroup'
import styles from 'drive/web/modules/search/components/styles.styl'
import { useRouter } from 'drive/lib/RouterContext'
import SearchEmpty from './components/SearchEmpty'

const SearchView = () => {
  const { t } = useI18n()
  const {
    isBusy,
    suggestions,
    fetchSuggestions,
    clearSuggestions,
    hasSuggestions,
    query,
    makeIndexes
  } = useSearch()
  const { router } = useRouter()
  const client = useClient()
  const { isMobile } = useBreakpoints()

  const [input, setInput] = useState('')

  const onInputChanged = event => {
    setInput(event.target.value)
    fetchSuggestions(event.target.value)
  }

  const navigateBack = useCallback(() => {
    router.goBack()
  }, [router])

  const openSuggestion = useCallback(
    async suggestion => {
      await openOnSelect(client, suggestion.onSelect)
    },
    [client]
  )

  const handleCleanInput = () => {
    clearSuggestions()
    setInput('')
  }

  const handleFocus = () => {
    makeIndexes()
  }

  const isSearchEmpty = query !== '' && !hasSuggestions && !isBusy

  return (
    <>
      {isMobile && (
        <BarLeft>
          <BackButton onClick={navigateBack} t={t} />
        </BarLeft>
      )}
      <BarSearch>
        <div
          className={cx(
            styles['bar-search-container'],
            isMobile ? styles['mobile'] : ''
          )}
          role="search"
        >
          <BarSearchInputGroup
            isInputNotEmpty={input !== ''}
            onClean={handleCleanInput}
            isBusy={isBusy}
          >
            <Input
              fullwidth={true}
              value={input}
              onChange={onInputChanged}
              placeholder={t('searchbar.placeholder')}
              onFocus={handleFocus}
              autoFocus
            />
          </BarSearchInputGroup>
        </div>
      </BarSearch>
      <div className="u-flex u-flex-column u-w-100">
        {isSearchEmpty ? (
          <SearchEmpty query={query} />
        ) : (
          <List>
            {suggestions.map(suggestion => (
              <SuggestionItem
                suggestion={suggestion}
                query={query}
                key={suggestion.id}
                onClick={openSuggestion}
              />
            ))}
          </List>
        )}
      </div>
    </>
  )
}

export default SearchView
