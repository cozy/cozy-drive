import styles from '../styles/albumsList'

import React from 'react'
import classNames from 'classnames'

import { withError } from '../components/ErrorComponent'
import { withEmpty } from '../components/Empty'

import AlbumItem from '../components/AlbumItem'

const DumbAlbumsList = props => (
  <div className={classNames(styles['pho-album-list'], styles['pho-album-list--thumbnails'], styles['pho-album-list--selectable'])}>
    {props.albums.entries.map((a) => <AlbumItem album={a} key={a._id} onServerError={props.onServerError} onClick={props.onSubmitSelectedAlbum} />)}
  </div>
)

const AlbumsList = withEmpty(props => props.albums.entries.length === 0, 'albums', DumbAlbumsList)

const DumbAlbumsView = props => (
  <div>
    <AlbumsList {...props} />
  </div>
)

const ErrorAlbumsView = withError(props => props.error, 'albums', DumbAlbumsView)

export const AlbumsView = (props) => {
  if (!props.albums) {
    return null
  }
  const error = props.albums.fetchingStatus === 'failed'
  return <ErrorAlbumsView error={error} onServerError={() => this.handleError(error)} {...props} />
}

export default AlbumsView
