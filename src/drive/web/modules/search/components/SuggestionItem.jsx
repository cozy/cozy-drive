import React, { useCallback } from 'react'

import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'
import FileIconMime from 'drive/web/modules/filelist/FileIconMime'

import SuggestionItemTextHighlighted from 'drive/web/modules/search/components/SuggestionItemTextHighlighted'
import SuggestionItemTextSecondary from 'drive/web/modules/search/components/SuggestionItemTextSecondary'

const SuggestionItem = ({
  suggestion,
  query,
  onClick,
  onParentOpened,
  isMobile = false
}) => {
  const openSuggestion = useCallback(() => {
    if (typeof onClick == 'function') {
      onClick(suggestion)
    }
  }, [suggestion, onClick])

  return (
    <ListItem button onClick={openSuggestion}>
      <ListItemIcon>
        <FileIconMime
          file={{
            type: suggestion.type,
            mime: suggestion.mime,
            name: suggestion.title
          }}
          isEncrypted={suggestion.isEncrypted}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <SuggestionItemTextHighlighted
            text={suggestion.title}
            query={query}
          />
        }
        secondary={
          <SuggestionItemTextSecondary
            text={suggestion.subtitle}
            url={suggestion.parentUrl}
            query={query}
            onOpened={onParentOpened}
            isMobile={isMobile}
          />
        }
      />
    </ListItem>
  )
}

export default SuggestionItem
