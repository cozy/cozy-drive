import styles from '../../../styles/albumsList.styl'

import React from 'react'
import classNames from 'classnames'

import { withError } from 'components/Error/ErrorComponent'
import { EmptyPhotos } from 'components/Error/Empty'

import AlbumItem from './AlbumItem'

const AlbumsList = props =>
  props.albums.data.length === 0 ? (
    <EmptyPhotos localeKey="albums" />
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
          thumbnail
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
  const error = props.albums.fetchStatus === 'failed'
  return (
    <ErrorAlbumsView
      error={error}
      onServerError={() => this.handleError(error)}
      {...props}
    />
  )
}

export default AlbumsView
