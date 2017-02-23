/* global cozy */
/**
  Albums related features
**/

import {
  ADD_TO_ALBUM,
  ADD_TO_ALBUM_FAILURE,
  ADD_TO_ALBUM_SUCCESS,
  CANCEL_ADD_TO_ALBUM,
  CREATE_ALBUM,
  CREATE_ALBUM_FAILURE,
  CREATE_ALBUM_SUCCESS,
  INDEX_ALBUMS_BY_NAME_SUCCESS
} from '../constants/actionTypes'

import {
  ALBUM_DOCTYPE
} from '../constants/config'

// create album
export const addToAlbum = (photos = [], album = null) => {
  return async dispatch => {
    if (!album) {
      return dispatch({
        type: ADD_TO_ALBUM,
        photos: photos
      })
    }

    album.photos = album.photos || []

    const photosWithNoDuplicates = photos.filter((photo) => {
      return album.photos.indexOf(photo) === -1
    })

    if (!photosWithNoDuplicates.length) {
      return dispatch({
        type: ADD_TO_ALBUM_FAILURE,
        error: 'Albums.add_to.error.already_added'
      })
    }

    album.photos = album.photos.concat(photosWithNoDuplicates)

    return await cozy.update(ALBUM_DOCTYPE, album, {
      photos: album.photos
    }).then(async (album) => {
      await cozy.addReferencedFiles(
        album,
        photosWithNoDuplicates
      ).then(() => {
        return dispatch({
          type: ADD_TO_ALBUM_SUCCESS,
          album: album
        })
      })
    }).catch((fetchError) => {
      return dispatch({
        type: ADD_TO_ALBUM_FAILURE,
        error: `Albums.add_photos.error.response.${fetchError.response.statusText}`
      })
    })
  }
}

export const cancelAddToAlbum = (photos = []) => {
  return async dispatch => {
    dispatch({
      type: CANCEL_ADD_TO_ALBUM,
      photos: photos
    })
  }
}

// Temporary parameter photos
export const createAlbum = (name = null, mangoIndex = null, photos = []) => {
  return async dispatch => {
    if (!name) {
      return dispatch({
        type: CREATE_ALBUM_FAILURE,
        error: 'Albums.create.error.name_missing'
      })
    }

    dispatch({
      type: CREATE_ALBUM,
      name: name
    })

    let existingAlbums

    try {
      mangoIndex = mangoIndex ||
        await cozy.defineIndex(ALBUM_DOCTYPE, ['name']).then((mangoIndex) => {
          dispatch({
            type: INDEX_ALBUMS_BY_NAME_SUCCESS,
            mangoIndex: mangoIndex
          })

          return mangoIndex
        })

      existingAlbums = await cozy.query(mangoIndex, {
        selector: { name: name },
        fields: ['_id']
      })
    } catch (error) {
      return dispatch({
        type: CREATE_ALBUM_FAILURE,
        error: 'Albums.create.error.fetch'
      })
    }

    if (existingAlbums.length) {
      return dispatch({
        type: CREATE_ALBUM_FAILURE,
        error: 'Albums.create.error.already_exists'
      })
    }

    return await cozy.create(ALBUM_DOCTYPE, {
      name: name
    }).catch((fetchError) => {
      return dispatch({
        type: CREATE_ALBUM_FAILURE,
        error: `Albums.create.error.response.${fetchError.response.statusText}`
      })
    }).then((album) => {
      addToAlbum(photos, album)(dispatch)

      return dispatch({
        type: CREATE_ALBUM_SUCCESS,
        album: album
      })
    }).catch((error) => {
      return dispatch({
        type: CREATE_ALBUM_FAILURE,
        error: error.message ? error.message : error
      })
    })
  }
}
