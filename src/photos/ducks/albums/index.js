import React from 'react'
import { withRouter } from 'react-router'
import { Query, withMutations } from 'cozy-client'
import AlbumsView from './components/AlbumsView'
import AlbumPhotos from './components/AlbumPhotos'
import PhotosPicker from './components/PhotosPicker'
import AddToAlbumModal from './components/AddToAlbumModal'
import Alerter from '../../components/Alerter'

export const DOCTYPE = 'io.cozy.photos.albums'

const ALBUMS_QUERY = client => client.all(DOCTYPE).include(['photos'])

const addPhotos = async (album, photos) => {
  try {
    const addedPhotos = await album.photos.add(photos)
    if (addedPhotos.length !== photos.length) {
      Alerter.info('Alerter.photos.already_added_photo')
    } else {
      Alerter.success('Albums.add_photos.success', {
        name: album.name,
        smart_count: photos.length
      })
    }
  } catch (error) {
    Alerter.error('Albums.add_photos.error.reference')
  }
}

const ALBUMS_MUTATIONS = (client, ownProps) => ({
  addPhotos,
  createAlbum: async (name, photos, created_at = new Date()) => {
    try {
      if (!name) {
        Alerter.error('Albums.create.error.name_missing')
        return
      }
      const album = { _type: DOCTYPE, name, created_at }
      const unique = await client.validate(album)
      if (unique !== true) {
        Alerter.error('Albums.create.error.already_exists', { name })
        return
      }
      const resp = await client.create(
        DOCTYPE,
        album,
        { photos },
        {
          updateQueries: {
            albums: (previousData, result) => [result.data, ...previousData]
          }
        }
      )
      Alerter.success('Albums.create.success', {
        name: album.name,
        smart_count: photos.length
      })
      return resp.data
    } catch (error) {
      Alerter.error('Albums.create.error.generic')
    }
  }
})

const ALBUM_QUERY = (client, ownProps) =>
  client.get(DOCTYPE, ownProps.router.params.albumId).include(['photos'])

const ALBUM_MUTATIONS = (client, ownProps) => ({
  updateAlbum: album => client.save(album),
  deleteAlbum: album =>
    client.destroy(album, {
      updateQueries: {
        albums: (previousData, result) =>
          previousData.filter(a => a.id !== album.id)
      }
    }),
  addPhotos,
  removePhotos: async (album, photos, clearSelection) => {
    try {
      await album.photos.remove(photos)
      Alerter.success('Albums.remove_photos.success', {
        album_name: album.name
      })
      clearSelection()
    } catch (e) {
      Alerter.error('Albums.remove_photos.error.generic')
    }
  }
})

const ConnectedAlbumsView = props => (
  <Query query={ALBUMS_QUERY} as="albums">
    {result => <AlbumsView albums={result} {...props} />}
  </Query>
)

const ConnectedAddToAlbumModal = props => (
  <Query query={ALBUMS_QUERY} as="albums" mutations={ALBUMS_MUTATIONS}>
    {(result, { createAlbum, addPhotos }) => (
      <AddToAlbumModal
        {...result}
        createAlbum={createAlbum}
        addPhotos={addPhotos}
        {...props}
      />
    )}
  </Query>
)

const ConnectedAlbumPhotos = withRouter(props => (
  <Query query={ALBUM_QUERY} {...props} mutations={ALBUM_MUTATIONS}>
    {({ data }, { updateAlbum, deleteAlbum, removePhotos }) => (
      <AlbumPhotos
        album={data ? data[0] : null}
        updateAlbum={updateAlbum}
        deleteAlbum={deleteAlbum}
        removePhotos={removePhotos}
        {...props}
      />
    )}
  </Query>
))

const CreateAlbumPicker = withMutations(ALBUMS_MUTATIONS)(PhotosPicker)

const ConnectedPhotosPicker = withRouter(({ params, ...props }) => {
  return params.albumId ? (
    <Query query={ALBUM_QUERY} mutations={ALBUMS_MUTATIONS} {...props}>
      {({ data }, { addPhotos }) => (
        <PhotosPicker album={data ? data[0] : null} addPhotos={addPhotos} />
      )}
    </Query>
  ) : (
    <CreateAlbumPicker />
  )
})

export {
  ConnectedAlbumsView as AlbumsView,
  ConnectedPhotosPicker as PhotosPicker,
  ConnectedAlbumPhotos as AlbumPhotos,
  ConnectedAddToAlbumModal as AddToAlbumModal
}

export const belongsToAlbums = photos => {
  if (!photos) {
    return false
  }
  for (const photo of photos) {
    if (
      photo.relationships &&
      photo.relationships.referenced_by &&
      photo.relationships.referenced_by.data &&
      photo.relationships.referenced_by.data.length > 0
    ) {
      const refs = photo.relationships.referenced_by.data
      for (const ref of refs) {
        if (ref.type === DOCTYPE) {
          return true
        }
      }
    }
  }
  return false
}
