import {
  fetchCollection,
  fetchDocument,
  fetchReferencedFiles,
  fetchSharings,
  createDocument,
  updateDocument,
  deleteDocument,
  addReferencedFiles,
  removeReferencedFiles,
  downloadArchive
} from 'cozy-client'

import AlbumToolbar from './components/AlbumToolbar'
import AlbumsToolbar from './components/AlbumsToolbar'
import PhotosPicker from './components/PhotosPicker'

export const DOCTYPE = 'io.cozy.photos.albums'

export const fetchAlbums = () => fetchCollection('albums', DOCTYPE)
export const fetchSharedAlbums = id => fetchSharings(DOCTYPE)
export const fetchAlbumPhotos = (id, skip = 0) =>
  fetchReferencedFiles({ _type: DOCTYPE, id }, skip)
export const fetchAlbum = id => fetchDocument(DOCTYPE, id)
export const fetchAlbumSharings = id => fetchSharings(DOCTYPE, id)
export const createAlbum = (name, createdAt = new Date()) =>
  createDocument(
    DOCTYPE,
    { name, created_at: createdAt },
    { updateCollections: ['albums'] }
  )
export const updateAlbum = album => updateDocument(album)
export const deleteAlbum = album =>
  deleteDocument(album, { updateCollections: ['albums'] })
export const addToAlbum = (album, photoIds) =>
  addReferencedFiles(album, photoIds)
export const removeFromAlbum = (album, photoIds) =>
  removeReferencedFiles(album, photoIds)
export const downloadAlbum = (album, photos) =>
  downloadArchive(album.name, photos.map(p => p.id))

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

export { AlbumToolbar, AlbumsToolbar, PhotosPicker }
