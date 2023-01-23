import { useState, useMemo } from 'react'
import debounce from 'lodash/debounce'

import { useClient } from 'cozy-client'

import { indexFiles } from 'drive/web/modules/search/components/helpers'

const useSearch = ({ limit = 10 } = {}) => {
  const client = useClient()
  const [allSuggestions, setAllSuggestions] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [fuzzy, setFuzzy] = useState(null)
  const [isBusy, setBusy] = useState(true)
  const [query, setQuery] = useState('')

  const makeIndexes = async () => {
    if (fuzzy == null) {
      setFuzzy(await indexFiles(client))
    }
  }

  const fetchSuggestions = debounce(value => {
    onFetchSuggestionsRequested(value)
  }, 250)

  const onFetchSuggestionsRequested = async value => {
    setBusy(true)
    let currentFuzzy = fuzzy
    if (currentFuzzy == null) {
      currentFuzzy = await indexFiles(client)
      setFuzzy(currentFuzzy)
    }
    const suggestions = currentFuzzy.search(value).map(result => ({
      id: result.id,
      title: result.name,
      subtitle: result.path,
      url: result.url,
      parentUrl: result.parentUrl,
      openOn: result.openOn,
      type: result.type,
      mime: result.mime,
      isEncrypted: result.isEncrypted,
      class: result.class
    }))

    setBusy(value === '') // To prevent empty state to appear at the first search
    setQuery(value)
    setAllSuggestions(suggestions)
    setSuggestions(suggestions.slice(0, limit))
  }

  const hasSuggestions = useMemo(() => suggestions.length > 0, [suggestions])

  const hasMore = useMemo(
    () => suggestions.length < allSuggestions.length,
    [suggestions, allSuggestions]
  )

  const fetchMore = async () => {
    setSuggestions(allSuggestions.slice(0, suggestions.length + limit))
  }

  const clearSuggestions = () => {
    fetchSuggestions.cancel()
    setBusy(true)
    setQuery('')
    setAllSuggestions([])
    setSuggestions([])
  }

  return {
    suggestions,
    fetchSuggestions,
    clearSuggestions,
    hasSuggestions,
    hasMore,
    isBusy,
    query,
    makeIndexes,
    fetchMore
  }
}

export default useSearch
