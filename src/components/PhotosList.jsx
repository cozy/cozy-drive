import styles from '../styles/photoList'

import React from 'react'
import { translate } from '../lib/I18n'

import Empty from './Empty'
import Loading from './Loading'
import SelectionBar from '../containers/SelectionBar'
import Photo from './Photo'

export const PhotosList = props => {
  const { f, photosByMonth, showSelection, selected, onPhotoToggle } = props
  const { isIndexing, isFetching, isWorking, isFirstFetch } = props
  if (isIndexing) {
    return <Loading loadingType='photos_indexing' />
  }
  if (isFetching || isFirstFetch) {
    return <Loading loadingType='photos_fetching' />
  }
  if (isWorking) {
    return <Loading loadingType='photos_upload' />
  }
  return (
    <div
      role='contentinfo'
      className={showSelection ? styles['pho-list-selection'] : ''}
    >
      {showSelection && <SelectionBar />}
      {Object.keys(photosByMonth).map(month => {
        return (
          <div className={styles['pho-section']} key={month}>
            <h3>{f(month, 'MMMM YYYY')}</h3>
            {photosByMonth[month].map(photo =>
              <Photo
                photo={photo}
                key={photo._id}
                selected={selected.indexOf(photo._id) !== -1}
                onToggle={onPhotoToggle}
              />
            )}
          </div>
        )
      })}
      {Object.keys(photosByMonth).length === 0 && <Empty emptyType='photos' />}
    </div>
  )
}

export default translate()(PhotosList)
