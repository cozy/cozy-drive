/* global cozy */
import {
  fetchDocuments,
  fetchDocument,
  fetchReferencedFiles,
  getEntityList,
  getEntity,
  getReferencedFilesList,
  createEntity,
  updateEntity,
  deleteEntity,
  checkUniquenessOf,
  addReferencedFiles,
  removeReferencedFiles,
  downloadArchive
} from '../../lib/redux-cozy-api'

const ALBUMS = 'io.cozy.photos.albums'
export const DOCTYPE = ALBUMS

export const fetchAlbums = () => fetchDocuments(ALBUMS)
export const getAlbumsList = (state) => getEntityList(state, ALBUMS)
// TODO
export const fetchAlbumCover = async (album) => cozy.client.files.statById(album.photos[0])

export const getAlbum = (state, id) => getEntity(state, ALBUMS, id /*, { include: ['photos'] } */)
// TODO: not ideal, too much impl details leak
export const getAlbumPhotos = (state, id) => getReferencedFilesList(state, ALBUMS, id, 'photos')
export const fetchAlbum = (id) => fetchDocument(ALBUMS, id, { include: ['photos'] })
// TODO: again, too much impl details leak
export const fetchAlbumPhotos = (album, skip = 0) => fetchReferencedFiles(album, 'photos', skip)

export const checkUniquenessOfAlbumName = (name) => checkUniquenessOf(ALBUMS, 'name', name)
export const createAlbum = (name, photoIds) => createEntity({ type: ALBUMS, name, photos: photoIds })

export const addToAlbum = (album, photoIds) => addReferencedFiles(album, 'photos', photoIds)
export const removeFromAlbum = (album, photoIds) => removeReferencedFiles(album, 'photos', photoIds)

export const updateAlbum = (album) => updateEntity(album)
export const deleteAlbum = (album) => deleteEntity(album)
export const downloadAlbum = (album, photos) => downloadArchive(album.name, photos.map(p => p.id))

// TODO: refactor these 3 actions somewhere...
const ADD_TO_ALBUM = 'ADD_TO_ALBUM'
const ADD_TO_ALBUM_SUCCESS = 'ADD_TO_ALBUM_SUCCESS'
const CANCEL_ADD_TO_ALBUM = 'CANCEL_ADD_TO_ALBUM'

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

import AlbumToolbar from './components/AlbumToolbar'
import AlbumsToolbar from './components/AlbumsToolbar'

export { AlbumToolbar, AlbumsToolbar }
