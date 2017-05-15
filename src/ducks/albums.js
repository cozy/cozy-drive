/* global cozy */
import { getList, createInsertAction, createFetchAction, createFetchIfNeededAction } from './lists'

import {
  ALBUM_DOCTYPE,
  FETCH_LIMIT
} from '../constants/config'

import Alerter from '../components/Alerter'
import FormattedError from '../lib/FormattedError'

const ALBUMS = 'albums'

const ADD_TO_ALBUM = 'ADD_TO_ALBUM'
const ADD_TO_ALBUM_SUCCESS = 'ADD_TO_ALBUM_SUCCESS'
const CANCEL_ADD_TO_ALBUM = 'CANCEL_ADD_TO_ALBUM'

// Return an index on albums based on names
const createIndex = async () => cozy.client.data.defineIndex(ALBUM_DOCTYPE, ['name'])

// Returns albums from the provided index
const fetchAll = async (index, skip = 0) => {
  return cozy.client.data.query(index, {
    selector: {'name': {'$gt': null}},
    fields: ['_id', '_type', 'name']
  })
  .then(albums => albums.map(album => Object.assign({}, album, { _type: ALBUM_DOCTYPE }))) // FIXME: this adds the missing _type to album
  .then(async albums => {
    for (let index in albums) {
      // TODO: we'll soon get a meta: count property for this query
      const photosIds = await cozy.client.data.listReferencedFiles(albums[index])
      albums[index].photoCount = photosIds.length
      albums[index].coverId = photosIds[0]
    }
    return { entries: albums }
  })
}

export const fetchAlbums = createFetchIfNeededAction(ALBUMS, (index, skip = 0) => {
  return index
    ? fetchAll(index, skip)
    : createIndex().then(index => fetchAll(index, skip))
})

const fetchPhotos = async (album, skip = 0) => {
  const photos = []
  const next = album.photoCount > skip + FETCH_LIMIT
  const limit = next ? FETCH_LIMIT : album.photoCount - skip
  const photosIds = await cozy.client.data.listReferencedFiles(album)
  for (let i = skip; i < skip + limit; i++) {
    const photo = await cozy.client.files.statById(photosIds[i])
    photos.push(Object.assign({}, photo, photo.attributes))
  }
  return { entries: photos, next, skip }
}

export const fetchAlbumPhotos = (albumId, skip = 0) =>
  (dispatch, getState) =>
    dispatch(createFetchAction(`${ALBUMS}/${albumId}`, fetchPhotos)(getAlbum(getState(), albumId), skip))

const checkExistingAlbumsByName = async (name = null, mangoIndex = null) => {
  mangoIndex = mangoIndex || await createIndex()
  return await cozy.client.data.query(mangoIndex, {
    selector: { name: name },
    fields: ['_id']
  })
}

const createEmptyAlbum = async (name = null) => {
  if (!name) {
    throw new FormattedError('Albums.create.error.name_missing', { name })
  }
  const existingAlbums = await checkExistingAlbumsByName(name)
  if (existingAlbums.length) {
    throw new FormattedError('Albums.create.error.already_exists', { name })
  }
  return await cozy.client.data.create(ALBUM_DOCTYPE, { name })
}

export const createAlbum = (name = null, photos = []) =>
  async dispatch => {
    return dispatch(createInsertAction(ALBUMS, async () => {
      const album = await createEmptyAlbum(name)
      return dispatch(addToAlbum(album, photos))
        .then(() => ({ entries: [album] }))
    })())
  }

export const addToAlbum = (album, photos = []) =>
  async dispatch =>
    dispatch(createInsertAction(`${ALBUMS}/${album._id}`, async () => {
      const newPhotos = photos.filter(photo => !album.photosIds || album.photosIds.indexOf(photo) === -1)
      if (newPhotos.length !== photos.length) {
        // TODO: find a way to remove this Alert call
        Alerter.info('Alerter.photos.already_added_photo')
      }
      if (newPhotos.length > 0) {
        return await cozy.client.data.addReferencedFiles(album, newPhotos)
      } else {
        throw new Error('Albums.add_photo.error.reference')
      }
    })())

export const removeFromAlbum = (photos = [], album = null) =>
  dispatch => cozy.client.data.removeReferencedFiles(album, photos)
    .then(() => dispatch({ type: ADD_TO_ALBUM_SUCCESS, album }))

export const deleteAlbum = album =>
  async dispatch =>
    cozy.client.data.delete(ALBUM_DOCTYPE, album)

// TODO: refactor these 3 actions somewhere...
export const openAddToAlbum = photos => ({
  type: ADD_TO_ALBUM,
  photos: photos
})

export const closeAddToAlbum = () => ({
  type: ADD_TO_ALBUM_SUCCESS
})

export const cancelAddToAlbum = photos => ({
  type: CANCEL_ADD_TO_ALBUM,
  photos: photos
})

// selectors
export const getAlbumsList = state => getList(state, ALBUMS)

export const getAlbum = (state, id) => {
  const list = getAlbumsList(state)
  return list ? list.entries.find(a => a._id === id) : null
}

export const getAlbumPhotos = (state, albumId) => getList(state, `${ALBUMS}/${albumId}`)
