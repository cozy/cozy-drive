import React, { FC } from 'react'

import { useQuery } from 'cozy-client'
import { IOCozyFile } from 'cozy-client/types/types'
import List from 'cozy-ui/transpiled/react/List'
import ListSubheader from 'cozy-ui/transpiled/react/ListSubheader'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FavoriteListItem } from 'modules/navigation/FavoriteListItem'
import { buildFavoritesQuery } from 'queries'

interface FavoriteListProps {
  className?: string
}

const FavoriteList: FC<FavoriteListProps> = ({ className }) => {
  const { t } = useI18n()
  const favoritesQuery = buildFavoritesQuery({
    sortAttribute: 'name',
    sortOrder: 'desc'
  })
  const favoritesResult = useQuery(
    favoritesQuery.definition,
    favoritesQuery.options
  ) as {
    data?: IOCozyFile[] | null
  }

  if (favoritesResult.data && favoritesResult.data.length > 0) {
    return (
      <List
        subheader={<ListSubheader>{t('Nav.item_favorites')}</ListSubheader>}
        className={className}
      >
        {favoritesResult.data.map(file => (
          <FavoriteListItem key={file._id} file={file} />
        ))}
      </List>
    )
  }

  return null
}

export { FavoriteList }
