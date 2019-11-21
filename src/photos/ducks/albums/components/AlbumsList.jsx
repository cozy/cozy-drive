import styles from 'photos/styles/albumsList.styl'

import React from 'react'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { EmptyPhotos } from 'components/Error/Empty'
import LoadMoreButton from 'photos/components/LoadMoreButton'
import AlbumItem from './AlbumItem'

const FALLBACK_CREATION_DATE = null
const sortByCreationDate = (a, b) => {
  // descending order, so newer albums first
  return (
    new Date(b.created_at || FALLBACK_CREATION_DATE) -
    new Date(a.created_at || FALLBACK_CREATION_DATE)
  )
}

const AlbumsList = ({ data, hasMore, fetchMore, t }) =>
  data.length === 0 ? (
    <EmptyPhotos localeKey="albums" />
  ) : (
    <Content>
      <div className={styles['pho-album-list']}>
        {data.sort(sortByCreationDate).map(a => (
          <AlbumItem album={a} key={a.id} />
        ))}
        {hasMore && (
          <LoadMoreButton label={t('Albums.load_more')} onClick={fetchMore} />
        )}
      </div>
    </Content>
  )

export default translate()(AlbumsList)
