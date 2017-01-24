import styles from '../styles/photosList'

import React from 'react'
import { translate } from '../lib/I18n'

import Empty from '../components/Empty'
import Loading from '../components/Loading'
import Photo from '../components/Photo'

const getPhotosSectionsByMonth = (f, photos) => {
  let sections = {}
  photos.map(p => {
    /* istanbul ignore else */
    if (!sections.hasOwnProperty(f(p.created_at, 'MMMM YYYY'))) {
      sections[f(p.created_at, 'MMMM YYYY')] = []
    }
    sections[f(p.created_at, 'MMMM YYYY')].push(p)
  })
  return sections
}

export const PhotosList = ({ t, f, photos, isIndexing, isFetching, isWorking, isFirstFetch }) => {
  if (isIndexing) {
    return <Loading loadingType='photos_indexing' />
  }
  if (isFetching || isFirstFetch) {
    return <Loading loadingType='photos_fetching' />
  }
  if (isWorking) {
    return <Loading loadingType='photos_upload' />
  }
  const sections = getPhotosSectionsByMonth(f, photos)
  return (
    <div role='contentinfo'>
      {Object.keys(sections).map(sectionName => {
        return (
          <div class={styles['pho-section']} key={sectionName}>
            <h3>{sectionName}</h3>
            {sections[sectionName].map(photo => {
              return <Photo photo={photo} key={photo._id} />
            })}
          </div>
        )
      })}
      {photos.length === 0 && <Empty emptyType='photos' />}
    </div>
  )
}

export default translate()(PhotosList)
