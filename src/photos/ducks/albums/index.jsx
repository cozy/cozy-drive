import React from 'react'

import { Query, withMutations } from 'cozy-client'
import { Alerter } from 'cozy-ui/transpiled/react/'

import AlbumsView from './components/AlbumsView'
import AlbumPhotos from './components/AlbumPhotos'
import PhotosPicker from './components/PhotosPicker'
import AddToAlbumModal from './components/AddToAlbumModal'
import Loading from '../../components/Loading'

import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import { useParams } from 'react-router-dom'
import { buildAlbumsQuery } from '../../queries/queries'

const ALBUMS_QUERY = client =>
  client
    .find(DOCTYPE_ALBUMS, { created_at: { $gt: null } })
    .where({
      auto: { $exists: false }
    })
    .indexFields(['created_at'])
    .include(['photos'])
    .sortBy([{ created_at: 'desc' }])

const addPhotos = async (album, photos) => {
  try {
    const photoCountBefore = album.photos.data.length
    await album.photos.addById(photos.map(({ _id }) => _id))
    const photoCountAfter = album.photos.data.length
    if (photoCountBefore + photos.length !== photoCountAfter) {
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

const ALBUM_MUTATIONS = client => ({
  updateAlbum: async album => {
    const unique = await client
      .collection(DOCTYPE_ALBUMS)
      .checkUniquenessOf('name', album.name)
    if (unique !== true) {
      Alerter.error('Albums.create.error.already_exists', { name })
      return
    } else {
      return client.save(album)
    }
  },
  deleteAlbum: album => client.destroy(album),
  addPhotos,
  removePhotos: async (album, photos, clearSelection) => {
    try {
      await album.photos.removeById(photos.map(({ _id }) => _id))
      Alerter.success('Albums.remove_photos.success', {
        album_name: album.name
      })
      clearSelection()
    } catch (e) {
      Alerter.error('Albums.remove_photos.error.generic')
    }
  }
})
const ALBUMS_MUTATIONS = client => ({
  addPhotos,
  createAlbum: async (name, photos, created_at = new Date()) => {
    try {
      if (!name) {
        Alerter.error('Albums.create.error.name_missing')
        return
      }
      const album = { _type: DOCTYPE_ALBUMS, name, created_at }

      const unique = await client
        .collection(DOCTYPE_ALBUMS)
        .checkUniquenessOf('name', album.name)
      if (unique !== true) {
        Alerter.error('Albums.create.error.already_exists', { name })
        return
      }
      const resp = await client.create(
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
      Alerter.error('Albums.create.error.generic')
    }
  }
})

const ConnectedAlbumsView = props => (
  <Query query={ALBUMS_QUERY}>
    {result => {
      return <AlbumsView albums={result} {...props} />
    }}
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

// eslint-disable-next-line react/display-name
export const AlbumPhotosWithLoader =
  ({ children }) =>
  // TODO: fix me
  // eslint-disable-next-line react/display-name
  (
    { data: album, fetchStatus, lastFetch },
    { updateAlbum, deleteAlbum, removePhotos }
  ) => {
    if (album && fetchStatus === 'loaded') {
      return (
        <AlbumPhotos
          album={album}
          photos={album.photos.data}
          updateAlbum={updateAlbum}
          deleteAlbum={deleteAlbum}
          removePhotos={removePhotos}
          hasMore={album.photos.hasMore !== undefined}
          fetchMore={album.photos.fetchMore.bind(album.photos)}
          lastFetch={lastFetch}
        >
          {children}
        </AlbumPhotos>
      )
    } else {
      return (
        <Loading
          size={'xxlarge'}
          loadingType={'photos_fetching'}
          middle={true}
        />
      )
    }
  }

export const ConnectedAlbumPhotos = props => {
  const { albumId } = useParams()
  const albumsQuery = buildAlbumsQuery(albumId)
  return (
    <Query
      query={albumsQuery.definition}
      as={albumsQuery.as}
      {...props}
      mutations={ALBUM_MUTATIONS}
    >
      {AlbumPhotosWithLoader({
        children: props.children
      })}
    </Query>
  )
}

const CreateAlbumPicker = withMutations(ALBUMS_MUTATIONS)(PhotosPicker)

const ConnectedPhotosPicker = ({ ...props }) => {
  const { albumId } = useParams()

  if (albumId) {
    const albumsQuery = buildAlbumsQuery(albumId)
    return (
      <Query
        query={albumsQuery.definition}
        as={albumsQuery.as}
        mutations={ALBUMS_MUTATIONS}
        {...props}
      >
        {({ data }, { addPhotos }) => (
          <PhotosPicker album={data} addPhotos={addPhotos} />
        )}
      </Query>
    )
  }

  return <CreateAlbumPicker />
}

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
