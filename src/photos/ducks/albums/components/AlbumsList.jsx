import styles from 'photos/styles/albumsList.styl'

import React from 'react'
import { Content } from 'cozy-ui/transpiled/react/Layout'
import { translate } from 'cozy-ui/transpiled/react/providers/I18n'

import { EmptyPhotos } from 'components/Error/Empty'
import AlbumItem from './AlbumItem'
import { LoadMore } from 'photos/components/LoadMore'

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
    <EmptyPhotos localeKey="albums" hasTextMobileVersion />
  ) : (
    <Content>
      <div className={styles['pho-album-list']}>
        {data.sort(sortByCreationDate).map(a => (
          <AlbumItem album={a} key={a.id} />
        ))}
        {hasMore && (
          <LoadMore label={t('Albums.load_more')} fetchMore={fetchMore} />
        )}
      </div>
    </Content>
  )

export default translate()(AlbumsList)
