import React from 'react'

import List from 'cozy-ui/transpiled/react/MuiCozyTheme/List'

import SuggestionItemSkeleton from 'drive/web/modules/search/components/SuggestionItemSkeleton'

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
