/* global cozy */
import {
  getList,
  createInsertAction,
  createDeleteAction,
  createFetchAction,
  createFetchIfNeededAction,
  createUpdateAction
} from '../lists'

import {
  ALBUM_DOCTYPE,
  FETCH_LIMIT
} from '../../constants/config'

import Alerter from '../../components/Alerter'
import FormattedError from '../../lib/FormattedError'

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
    fields: ['_id', '_type', '_rev', 'name']
  })
  .then(albums => albums.map(album => Object.assign({}, album, { _type: ALBUM_DOCTYPE }))) // FIXME: this adds the missing _type to album
  .then(async albums => {
    for (let index in albums) {
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

export const fetchAlbum = async (albumId) => cozy.client.data.find(ALBUM_DOCTYPE, albumId)

export const fetchPhotos = async (album, skip = 0) => {
  const photos = []
  const { data, included, meta } = await cozy.client.data.fetchReferencedFiles(album, { skip, limit: FETCH_LIMIT })
  return {
    entries: data.map((object, idx) => Object.assign({ _id: object.id }, object, included[idx])),
    next: meta.count > skip + FETCH_LIMIT,
    skip
  }
}

export const fetchAlbumPhotos = (albumId, skip = 0) =>
  (dispatch, getState) =>
    dispatch(createFetchAction(`${ALBUMS}/${albumId}`, fetchPhotos)(getAlbum(getState(), albumId), skip))

export const fetchAlbumCover = async (album) => cozy.client.files.statById(album.coverId)

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

export const downloadAlbum = async (album, photos) => {
  const filename = slugify(album.name)
  const href = await cozy.client.files.getArchiveLinkByIds(photos.map(p => p._id), filename)
  const fullpath = await cozy.client.fullpath(href)
  forceFileDownload(fullpath, filename + '.zip')
}

const slugify = (text) =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '')             // Trim - from end of text

const forceFileDownload = (href, filename) => {
  const element = document.createElement('a')
  element.setAttribute('href', href)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
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
      // TODO: this doesn't work anymore...
      const newPhotos = photos.filter(photo => !album.photosIds || album.photosIds.indexOf(photo) === -1)
      if (newPhotos.length !== photos.length) {
        // TODO: find a way to remove this Alert call
        Alerter.info('Alerter.photos.already_added_photo')
      }
      if (newPhotos.length > 0) {
        await cozy.client.data.addReferencedFiles(album, newPhotos)
        return { entries: newPhotos }
      } else {
        throw new FormattedError('Albums.add_photo.error.reference')
      }
    })())

export const removeFromAlbum = (album, photos = []) =>
  async dispatch =>
    dispatch(createDeleteAction(`${ALBUMS}/${album._id}`, async () => {
      await cozy.client.data.removeReferencedFiles(album, photos)
      return { entries: photos }
    })())
    // TODO: this is only for closing the selectionBar properly... Fix this!
    .then(() => {
      const meta = { cancelSelection: true }
      return dispatch({ type: 'REMOVE_FROM_ALBUM', meta })
    })

export const updateAlbum = createUpdateAction(ALBUMS, async (album) => {
  let updatedAlbum = await cozy.client.data.updateAttributes(ALBUM_DOCTYPE, album._id, album)
  return { entries: [updatedAlbum] }
})

export const deleteAlbum = createDeleteAction(ALBUMS, async (album) => {
  await cozy.client.data.delete(ALBUM_DOCTYPE, album)
  return { entries: [album] }
})

// TODO: refactor these 3 actions somewhere...
export const openAddToAlbum = photos => ({
  type: ADD_TO_ALBUM,
  photos: photos
})

export const closeAddToAlbum = () => {
  const meta = { cancelSelection: true }
  return { type: ADD_TO_ALBUM_SUCCESS, meta }
}

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

import AlbumToolbar from './components/AlbumToolbar'

export { AlbumToolbar }
