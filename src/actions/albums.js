/**
  Albums related features
**/

import cozy from 'cozy-client-js'

import {
  ADD_TO_ALBUM,
  CANCEL_ADD_TO_ALBUM,
  CREATE_ALBUM_FAILURE,
  CREATE_ALBUM_SUCCESS
} from '../constants/actionTypes'

import {
  ALBUM_DOCTYPE
} from '../constants/config'

// create album
export const addToAlbum = (id = null, photos = []) => {
  return async dispatch => {
    if (id) {
      // Call cozy client to create album
    } else {
      dispatch({
        type: ADD_TO_ALBUM,
        id: id,
        photos: photos
      })
    }
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

export const createAlbum = (name = null) => {
  return async dispatch => {
    if (!name) {
      return dispatch({
        type: CREATE_ALBUM_FAILURE,
        error: 'Albums.create.error.name_missing'
      })
    }

    await cozy.create(ALBUM_DOCTYPE, {
      name: name
    }).catch((fetchError) => {
      return dispatch({
        type: CREATE_ALBUM_FAILURE,
        error: `Albums.create.error.response.${fetchError.response.statusText}`
      })
    }).then((album) => {
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
