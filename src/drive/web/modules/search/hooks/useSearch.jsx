import { useState, useMemo } from 'react'
import debounce from 'lodash/debounce'

import { useClient } from 'cozy-client'

import { indexFiles } from 'drive/web/modules/search/components/helpers'

const MAX_SUGGESTIONS = 10

const useSearch = () => {
  const client = useClient()
  const [suggestions, setSuggestions] = useState([])
  const [fuzzy, setFuzzy] = useState(null)
  const [isBusy, setBusy] = useState(false)
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
    setQuery(value)
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
        term: result.name,
        onSelect: result.onSelect || 'open:' + result.url,
        icon: result.icon
      }))

    setSuggestions(suggestions.slice(0, MAX_SUGGESTIONS))
    setBusy(false)
  }

  const hasSuggestions = useMemo(() => suggestions.length > 0, [suggestions])

  const clearSuggestions = () => {
    fetchSuggestions.cancel()
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
