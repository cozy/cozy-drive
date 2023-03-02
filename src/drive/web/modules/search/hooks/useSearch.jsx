import { useState, useEffect, useMemo } from 'react'

import { useClient } from 'cozy-client'

import { indexFiles } from 'drive/web/modules/search/components/helpers'
import useDebounce from 'drive/hooks/useDebounce'

const useSearch = (searchTerm, { limit = 10 } = {}) => {
  const client = useClient()
  const [allSuggestions, setAllSuggestions] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [fuzzy, setFuzzy] = useState(null)
  const [isBusy, setBusy] = useState(true)
  const [query, setQuery] = useState('')

  const debouncedSearchTerm = useDebounce(searchTerm, {
    delay: 500,
    ignore: searchTerm === ''
  })

  const makeIndexes = async () => {
    if (fuzzy == null) {
      setFuzzy(await indexFiles(client))
    }
  }

  useEffect(() => {
    const fetchSuggestions = async value => {
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

    if (debouncedSearchTerm !== '') {
      fetchSuggestions(debouncedSearchTerm)
    } else {
      clearSuggestions()
    }
  }, [client, debouncedSearchTerm, fuzzy, limit])

  const hasSuggestions = useMemo(() => suggestions.length > 0, [suggestions])

  const hasMore = useMemo(
    () => suggestions.length < allSuggestions.length,
    [suggestions, allSuggestions]
  )

  const fetchMore = async () => {
    setSuggestions(allSuggestions.slice(0, suggestions.length + limit))
  }

  const clearSuggestions = () => {
    setBusy(true)
    setQuery('')
    setAllSuggestions([])
    setSuggestions([])
  }

  return {
    suggestions,
    hasSuggestions,
    hasMore,
    isBusy,
    query,
    makeIndexes,
    fetchMore
  }
}

export default useSearch
