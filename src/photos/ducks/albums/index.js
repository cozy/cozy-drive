import React from 'react'
import { withRouter } from 'react-router'
import { Query, withMutations } from 'cozy-client'
import SharingProvider from 'sharing'
import AlbumsView from './components/AlbumsView'
import AlbumPhotos from './components/AlbumPhotos'
import PhotosPicker from './components/PhotosPicker'
import AddToAlbumModal from './components/AddToAlbumModal'
import { Alerter, Spinner } from 'cozy-ui/react/'
import { DOCTYPE_ALBUMS, DOCTYPE_FILES } from 'drive/lib/doctypes'

const ALBUMS_QUERY = client =>
  client
    .find(DOCTYPE_ALBUMS, { created_at: { $gt: null } })
    .where({
      auto: { $exists: false }
    })
    .indexFields(['created_at'])
    .include(['photos'])
    .sortBy([{ created_at: 'desc' }])

const ALBUM_QUERY = (client, ownProps) => {
  return client.get(DOCTYPE_FILES).referencedBy({
    _type: DOCTYPE_ALBUMS,
    _id: ownProps.router.params.albumId
  })
}
const ALBUM_GET_ONE = (client, ownProps) =>
  client.get(DOCTYPE_ALBUMS, ownProps.router.params.albumId)

const ALBUM_MUTATIONS = query => ({
  updateAlbum: album => query.client.save(album),
  deleteAlbum: album => query.client.destroy(album),
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

const ALBUMS_MUTATIONS = client => ({
  addPhotos,
  createAlbum: async (name, photos, created_at = new Date()) => {
    try {
      if (!name) {
        Alerter.error('Albums.create.error.name_missing')
        return
      }
      const album = { _type: DOCTYPE_ALBUMS, name, created_at }
      /*
        !WHY do I need that stuff ? withMutations() and mutations='' are not
        sending the same props
        */
      const realClient =
        typeof client.validate === 'function' ? client : client.client

      const unique = await realClient.validate(album)
      if (unique !== true) {
        Alerter.error('Albums.create.error.already_exists', { name })
        return
      }
      const resp = await realClient.create(
        DOCTYPE_ALBUMS,
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
      console.log({ error })
      Alerter.error('Albums.create.error.generic')
    }
  }
})

const ConnectedAlbumsView = props => (
  <SharingProvider doctype={DOCTYPE_ALBUMS} documentType="Albums">
    <Query query={ALBUMS_QUERY}>
      {result => {
        return <AlbumsView albums={result} {...props} />
      }}
    </Query>
  </SharingProvider>
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
    {(
      { data, hasMore, fetchMore, fetchStatus },
      { updateAlbum, deleteAlbum, removePhotos }
    ) => {
      if (fetchStatus === 'loaded') {
        return (
          <Query query={ALBUM_GET_ONE} {...props}>
            {({ data: album, fetchStatus }) => {
              if (fetchStatus === 'loaded') {
                return (
                  <AlbumPhotos
                    album={album}
                    photos={data}
                    updateAlbum={updateAlbum}
                    deleteAlbum={deleteAlbum}
                    removePhotos={removePhotos}
                    hasMore={hasMore}
                    fetchMore={fetchMore}
                    {...props}
                  />
                )
              } else {
                return (
                  <Spinner
                    size={'xxlarge'}
                    loadingType={'photos_fetching'}
                    middle={true}
                  />
                )
              }
            }}
          </Query>
        )
      } else {
        return (
          <Spinner
            size={'xxlarge'}
            loadingType={'photos_fetching'}
            middle={true}
          />
        )
      }
    }}
  </Query>
))

const CreateAlbumPicker = withMutations(ALBUMS_MUTATIONS)(PhotosPicker)

const ConnectedPhotosPicker = withRouter(({ params, ...props }) => {
  return params.albumId ? (
    <Query query={ALBUM_QUERY} mutations={ALBUMS_MUTATIONS} {...props}>
      {({ data }, { addPhotos }) => (
        <PhotosPicker album={data} addPhotos={addPhotos} />
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
        if (ref.type === DOCTYPE_ALBUMS) {
          return true
        }
      }
    }
  }
  return false
}
