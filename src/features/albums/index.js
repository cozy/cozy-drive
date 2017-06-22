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

export const fetchAlbums = () => fetchDocuments(ALBUMS)
export const getAlbumsList = (state) => getEntityList(state, ALBUMS)
// TODO
export const fetchAlbumCover = async (album) => cozy.client.files.statById(album.photos[0])

export const getAlbum = (state, id) => getEntity(state, ALBUMS, id /*, { include: ['photos'] }*/)
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
