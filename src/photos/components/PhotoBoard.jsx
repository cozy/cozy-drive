import styles from '../styles/photoList.styl'

import React from 'react'
import { withContentRect } from 'react-measure'
import { useI18n } from 'cozy-ui/transpiled/react/I18n'

import PhotoList from './PhotoList'
import { EmptyPhotos } from 'components/Error/Empty'
import Loading from './Loading'
import ErrorComponent from 'components/Error/ErrorComponent'
import LoadMoreButton from './LoadMoreButton'

const PhotoBoard = ({
  lists,
  selected,
  photosContext,
  showSelection,
  onPhotoToggle,
  onPhotosSelect,
  onPhotosUnselect,
  fetchStatus,
  hasMore,
  fetchMore,
  measureRef,
  contentRect: {
    entry: { width }
  },
  lastFetch
}) => {
  const { t, f } = useI18n()

  const isError = fetchStatus === 'failed'
  const isFetching =
    (fetchStatus === 'pending' || fetchStatus === 'loading') && !lastFetch

  if (isError) {
    return <ErrorComponent errorType={`${photosContext}_photos`} />
  }
  if (isFetching) {
    return <Loading loadingType="photos_fetching" />
  }
  if (!isFetching && (lists.length === 0 || lists[0].photos.length === 0)) {
    return <EmptyPhotos localeKey={`${photosContext}_photos`} />
  }

  return (
    <div
      className={showSelection ? styles['pho-list-selection'] : ''}
      ref={measureRef}
    >
      {lists.map((photoList, idx) => (
        <PhotoList
          key={idx}
          title={
            photoList.title ||
            (photoList.month ? f(photoList.month, 'MMMM YYYY') : '')
          }
          photos={photoList.photos}
          selected={selected}
          showSelection={showSelection}
          onPhotoToggle={onPhotoToggle}
          onPhotosSelect={onPhotosSelect}
          onPhotosUnselect={onPhotosUnselect}
          containerWidth={width}
        />
      ))}
      {hasMore && (
        <LoadMoreButton
          label={t('Board.load_more')}
          width={width}
          onClick={fetchMore}
        />
      )}
    </div>
  )
}

export default withContentRect()(PhotoBoard)
