import { useState, useMemo } from 'react'
import debounce from 'lodash/debounce'

import { useClient } from 'cozy-client'

import { indexFiles } from 'drive/web/modules/search/components/helpers'

const MAX_SUGGESTIONS = 10

const useSearch = () => {
  const client = useClient()
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
    const suggestions = currentFuzzy
      .search(value, { limit: MAX_SUGGESTIONS })
      .map(result => ({
        id: result.id,
        title: result.name,
        subtitle: result.path,
        url: result.url,
        parentUrl: result.parentUrl,
        openOn: result.openOn,
        icon: result.icon
      }))

    setBusy(value === '') // To prevent empty state to appear at the first search
    setQuery(value)
    setSuggestions(suggestions.slice(0, MAX_SUGGESTIONS))
  }

  const hasSuggestions = useMemo(() => suggestions.length > 0, [suggestions])

  const clearSuggestions = () => {
    fetchSuggestions.cancel()
    setBusy(true)
    setQuery('')
    setSuggestions([])
  }

  return {
    suggestions,
    fetchSuggestions,
    clearSuggestions,
    hasSuggestions,
    isBusy,
    query,
    makeIndexes
  }
}

export default useSearch
