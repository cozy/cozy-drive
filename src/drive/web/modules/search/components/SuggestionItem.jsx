import React from 'react'

import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

import { normalizeString } from 'drive/web/modules/search/components/helpers'

/**
 * Add <b> on part that equlas query into each result
 *
 * @param {Array} searchResult - list of results
 * @param {string} query - search input
 * @returns list of results with the query highlighted
 */
const highlightQueryTerms = (searchResult, query) => {
  const normalizedQueryTerms = normalizeString(query)
  const normalizedResultTerms = normalizeString(searchResult)

  const matchedIntervals = []
  const spacerLength = 1
  let currentIndex = 0

  normalizedResultTerms.forEach(resultTerm => {
    normalizedQueryTerms.forEach(queryTerm => {
      const index = resultTerm.indexOf(queryTerm)
      if (index >= 0) {
        matchedIntervals.push({
          from: currentIndex + index,
          to: currentIndex + index + queryTerm.length
        })
      }
    })

    currentIndex += resultTerm.length + spacerLength
  })

  // matchedIntervals can overlap, so we merge them.
  // - sort the intervals by starting index
  // - add the first interval to the stack
  // - for every interval,
  // - - add it to the stack if it doesn't overlap with the stack top
  // - - or extend the stack top if the start overlaps and the new interval's top is bigger
  const mergedIntervals = matchedIntervals
    .sort((intervalA, intervalB) => intervalA.from > intervalB.from)
    .reduce((computedIntervals, newInterval) => {
      if (
        computedIntervals.length === 0 ||
        computedIntervals[computedIntervals.length - 1].to < newInterval.from
      ) {
        computedIntervals.push(newInterval)
      } else if (
        computedIntervals[computedIntervals.length - 1].to < newInterval.to
      ) {
        computedIntervals[computedIntervals.length - 1].to = newInterval.to
      }

      return computedIntervals
    }, [])

  // create an array containing the entire search result, with special characters, and the intervals surrounded y `<b>` tags
  const slicedOriginalResult =
    mergedIntervals.length > 0
      ? [<span key="0">{searchResult.slice(0, mergedIntervals[0].from)}</span>]
      : searchResult

  for (let i = 0, l = mergedIntervals.length; i < l; ++i) {
    slicedOriginalResult.push(
      <span className="u-primaryColor">
        {searchResult.slice(mergedIntervals[i].from, mergedIntervals[i].to)}
      </span>
    )
    if (i + 1 < l)
      slicedOriginalResult.push(
        <span>
          {searchResult.slice(
            mergedIntervals[i].to,
            mergedIntervals[i + 1].from
          )}
        </span>
      )
  }

  if (mergedIntervals.length > 0)
    slicedOriginalResult.push(
      <span>
        {searchResult.slice(
          mergedIntervals[mergedIntervals.length - 1].to,
          searchResult.length
        )}
      </span>
    )

  return slicedOriginalResult
}

const SuggestionItem = ({ suggestion, query }) => {
  const renderHighlitedItems = items => {
    if (Array.isArray(items)) {
      return items.map((item, idx) => ({
        ...item,
        key: idx
      }))
    }
    return items
  }

  return (
    <ListItem button>
      <ListItemIcon>
        {suggestion.icon && (
          <img src={suggestion.icon} alt="icon" width={32} height={32} />
        )}
      </ListItemIcon>
      <ListItemText
        primary={renderHighlitedItems(
          highlightQueryTerms(suggestion.title, query)
        )}
        secondary={renderHighlitedItems(
          highlightQueryTerms(suggestion.subtitle, query)
        )}
      />
    </ListItem>
  )
}

export default SuggestionItem
