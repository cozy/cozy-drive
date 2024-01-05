import React from 'react'

import List from 'cozy-ui/transpiled/react/List'

import SuggestionItemSkeleton from 'modules/search/components/SuggestionItemSkeleton'

const SuggestionListSkeleton = ({ count }) => (
  <List>
    {Array(count || 4)
      .fill(1)
      .map((_, i) => (
        <SuggestionItemSkeleton key={i} />
      ))}
  </List>
)

export default SuggestionListSkeleton
