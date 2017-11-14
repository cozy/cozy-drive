import styles from '../styles/albumsList'

import React from 'react'
import classNames from 'classnames'

import { withError } from 'components/Error/ErrorComponent'
import Empty from 'components/Error/Empty-photos'

import AlbumItem from '../containers/AlbumItem'

const AlbumsList = props =>
  props.albums.data.length === 0 ? (
    <Empty emptyType="albums" />
  ) : (
    <div
      className={classNames(
        styles['pho-album-list'],
        styles['pho-album-list--thumbnails'],
        styles['pho-album-list--selectable']
      )}
    >
      {props.albums.data.map(a => (
        <AlbumItem
          album={a}
          key={a.id}
          onServerError={props.onServerError}
          onClick={props.onSubmitSelectedAlbum}
        />
      ))}
    </div>
  )

const DumbAlbumsView = props => (
  <div>
    <AlbumsList {...props} />
  </div>
)

const ErrorAlbumsView = withError(
  props => props.error,
  'albums',
  DumbAlbumsView
)

export const AlbumsView = props => {
  if (!props.albums) {
    return null
  }
  const error = props.albums.fetchingStatus === 'failed'
  return (
    <ErrorAlbumsView
      error={error}
      onServerError={() => this.handleError(error)}
      {...props}
    />
  )
}

export default AlbumsView
