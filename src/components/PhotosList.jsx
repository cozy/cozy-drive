import styles from '../styles/photosList'

import React from 'react'
import { translate } from '../lib/I18n'

import Empty from '../components/Empty'
import Loading from '../components/Loading'

const getPhotosSectionsByMonth = (f, photos) => {
  let sections = {}
  photos.map(p => {
    if (!sections.hasOwnProperty(f(p.created_at, 'MMMM YYYY'))) {
      sections[f(p.created_at, 'MMMM YYYY')] = []
    }
    sections[f(p.created_at, 'MMMM YYYY')].push(p)
  })
  return sections
}

const PhotosList = ({ t, f, photos, isIndexing, isFetching, isWorking, isFirstFetch }) => {
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
          <div class={styles['pho-section']}>
            <h3>{sectionName}</h3>
            {sections[sectionName].map(photo => {
              return <img
                class={styles['pho-photo']}
                height='300'
                style='margin-right:.5em'
                src={`http://cozy.local:8080/files/download/${photo._id}`}
              />
            })}
          </div>
        )
      })}
      {photos.length === 0 && <Empty emptyType='photos' />}
    </div>
  )
}

export default translate()(PhotosList)
