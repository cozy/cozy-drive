import {
  fetchCollection,
  fetchDocument,
  fetchReferencedFiles,
  createDocument,
  updateDocument,
  deleteDocument,
  addReferencedFiles,
  removeReferencedFiles,
  downloadArchive
} from '../../lib/redux-cozy-client'

export const DOCTYPE = 'io.cozy.photos.albums'

export const fetchAlbums = () => fetchCollection('albums', DOCTYPE)
export const fetchAlbumPhotos = (album, skip = 0) => fetchReferencedFiles(album, skip)
export const fetchAlbum = (id) => fetchDocument(DOCTYPE, id)
export const createAlbum = (name, createdAt = new Date()) => createDocument({ type: DOCTYPE, name, 'created_at': createdAt }, { updateCollections: ['albums'] })
export const updateAlbum = (album) => updateDocument(album)
export const deleteAlbum = (album) => deleteDocument(album, { updateCollections: ['albums'] })
export const addToAlbum = (album, photoIds) => addReferencedFiles(album, photoIds)
export const removeFromAlbum = (album, photoIds) => removeReferencedFiles(album, photoIds)
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
import PhotosPicker from './components/PhotosPicker'

export { AlbumToolbar, AlbumsToolbar, PhotosPicker }
