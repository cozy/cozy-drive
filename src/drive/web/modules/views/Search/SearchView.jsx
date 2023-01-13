import React, { useState, useCallback } from 'react'
import cx from 'classnames'

import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'
import Input from 'cozy-ui/transpiled/react/Input'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'
import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'
import { isFlagshipApp } from 'cozy-device-helper'
import { useWebviewIntent } from 'cozy-intent'
import { models, useClient } from 'cozy-client'
import LoadMore from 'cozy-ui/transpiled/react/LoadMore'

import BackButton from 'components/Button/BackButton'
import { BarLeft, BarSearch } from 'components/Bar'
import useSearch from 'drive/web/modules/search/hooks/useSearch'
import SuggestionItem from 'drive/web/modules/search/components/SuggestionItem'
import SuggestionListSkeleton from 'drive/web/modules/search/components/SuggestionListSkeleton'
import BarSearchInputGroup from 'drive/web/modules/search/components/BarSearchInputGroup'
import styles from 'drive/web/modules/search/components/styles.styl'
import SearchEmpty from './components/SearchEmpty'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const SearchView = () => {
  const { t } = useI18n()
  const {
    isBusy,
    suggestions,
    fetchSuggestions,
    clearSuggestions,
    hasSuggestions,
    query,
    makeIndexes,
    hasMore,
    fetchMore
  } = useSearch({ limit: 25 })
  const webviewIntent = useWebviewIntent()
  const { search } = useLocation()
  const navigate = useNavigate()
  const { isMobile } = useBreakpoints()
  const client = useClient()

  const [input, setInput] = useState('')

  useEffect(() => {
    makeIndexes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onInputChanged = event => {
    setInput(event.target.value)
    fetchSuggestions(event.target.value)
  }

  const navigateBack = useCallback(() => {
    const params = new URLSearchParams(search)
    const returnPath = params.get('returnPath')
    navigate(returnPath ? returnPath : '/')
  }, [navigate, search])

  const openSuggestion = useCallback(
    async suggestion => {
      if (suggestion.openOn === 'drive') {
        navigate(suggestion.url)
      } else if (suggestion.openOn === 'notes') {
        const url = await models.note.fetchURL(client, {
          id: suggestion.url.substr(3)
        })
        if (isFlagshipApp()) {
          webviewIntent.call('openApp', url, {
            slug: 'notes'
          })
        } else {
          window.location.assign(url)
        }
      } else {
        console.error(
          `openSuggestion (${suggestion.name}) could not be executed`
        )
      }
    },
    [navigate, webviewIntent, client]
  )

  const handleCleanInput = () => {
    clearSuggestions()
    setInput('')
  }

  const hasNoSearchResult = input !== '' && !hasSuggestions

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
            isMobile={isMobile}
            isInputNotEmpty={input !== ''}
            onClean={handleCleanInput}
          >
            <Input
              fullwidth={true}
              value={input}
              onChange={onInputChanged}
              placeholder={t('searchbar.placeholder')}
              autoFocus
            />
          </BarSearchInputGroup>
        </div>
      </BarSearch>
      <div className="u-flex u-flex-column u-w-100 u-ov-auto">
        {hasSuggestions && (
          <List>
            {suggestions.map(suggestion => (
              <SuggestionItem
                suggestion={suggestion}
                query={query}
                key={suggestion.id}
                onClick={openSuggestion}
                isMobile={isMobile}
              />
            ))}
          </List>
        )}
        {hasMore && (
          <div className="u-flex u-flex-justify-center">
            <LoadMore label={t('table.load_more')} fetchMore={fetchMore} />
          </div>
        )}
        {hasNoSearchResult && !isBusy && <SearchEmpty query={query} />}
        {hasNoSearchResult && isBusy && <SuggestionListSkeleton count={10} />}
      </div>
    </>
  )
}

export default SearchView
