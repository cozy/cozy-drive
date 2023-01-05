import React from 'react'

import Skeleton from 'cozy-ui/transpiled/react/Skeleton'
import ListItem from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItem'
import ListItemIcon from 'cozy-ui/transpiled/react/MuiCozyTheme/ListItemIcon'
import ListItemText from 'cozy-ui/transpiled/react/ListItemText'

const SuggestionItemSkeleton = () => {
  return (
    <ListItem>
      <ListItemIcon>
        <Skeleton
          width={32}
          height={32}
          variant="rect"
          animation="wave"
          className="u-bdrs-4"
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Skeleton
            width={196}
            height={8}
            variant="rect"
            animation="wave"
            className="u-bdrs-3 u-mb-half"
          />
        }
        secondary={
          <Skeleton
            width={96}
            height={8}
            variant="rect"
            animation="wave"
            className="u-bdrs-3"
          />
        }
      />
    </ListItem>
  )
}

export default SuggestionItemSkeleton
