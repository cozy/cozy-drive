import styles from '../styles/albumsList'

import React from 'react'

import { withEmpty } from '../components/Empty'
import AlbumItem from '../containers/AlbumItem'

const FALLBACK_CREATION_DATE = null
const sortByCreationDate = (a, b) => {
  // descending order, so newer albums first
  return (
    new Date(b.created_at || FALLBACK_CREATION_DATE) -
    new Date(a.created_at || FALLBACK_CREATION_DATE)
  )
}

const DumbAlbumsList = props => (
  <div role="contentinfo">
    <div className={styles['pho-album-list']}>
      {props.albums
        .sort(sortByCreationDate)
        .map(a => (
          <AlbumItem album={a} key={a.id} onServerError={props.onServerError} />
        ))}
    </div>
  </div>
)

const AlbumsList = withEmpty(props => props.albums.length === 0, DumbAlbumsList)

export default AlbumsList
