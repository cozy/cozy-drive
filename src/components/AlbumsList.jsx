import styles from '../styles/albumsList'

import React from 'react'

import { withEmpty } from '../components/Empty'
import AlbumItem from '../containers/AlbumItem'

const FALLBACK_CREATION_DATE = null
const sortByCreationDate = (a, b) => {
  // descending order, so newer albums first
  return (new Date(b.created_at || FALLBACK_CREATION_DATE)) - (new Date(a.created_at || FALLBACK_CREATION_DATE))
}

const DumbAlbumsList = props => (
  <div className={styles['pho-album-list']}>
    {props.albums.sort(sortByCreationDate).map((a) =>
      <AlbumItem album={a} sharedByMe={props.sharedByMe.indexOf(a.id) !== -1} sharedWithMe={props.sharedWithMe.indexOf(a.id) !== -1} key={a.id} onServerError={props.onServerError} />)}
  </div>
)

const AlbumsList = withEmpty(props => props.albums.length === 0, 'albums', DumbAlbumsList)

export default AlbumsList
