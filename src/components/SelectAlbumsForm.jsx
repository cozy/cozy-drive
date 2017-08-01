import styles from '../styles/albumsList'

import React from 'react'
import classNames from 'classnames'

import { withError } from '../components/ErrorComponent'
import { withEmpty } from '../components/Empty'

import AlbumItem from '../containers/AlbumItem'

const DumbAlbumsList = props => (
  <div className={classNames(styles['pho-album-list'], styles['pho-album-list--thumbnails'], styles['pho-album-list--selectable'])}>
    {props.albums.data.map((a) => <AlbumItem album={a} key={a.id} sharedWithMe={props.sharedWithMe.indexOf(a.id) !== -1} onServerError={props.onServerError} onClick={props.onSubmitSelectedAlbum} disabled={props.sharedWithMe.indexOf(a.id) !== -1} />)}
  </div>
)

const AlbumsList = withEmpty(props => props.albums.data.length === 0, 'albums', DumbAlbumsList)

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
