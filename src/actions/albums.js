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

    return await cozy.addReferencedFiles(album, photos)
      .catch(fetchError => {
        let error = fetchError.response.statusText
        dispatch({
          type: ADD_TO_ALBUM_FAILURE,
          error: error
        })
        throw error
      }).then(() => {
        dispatch({
          type: ADD_TO_ALBUM_SUCCESS,
          album: album
        })
        return album
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

// Return an index on albums based on names
export const createAlbumMangoIndex = () => {
  return async dispatch => {
    return cozy.defineIndex(ALBUM_DOCTYPE, ['name'])
      .then(mangoIndex => {
        dispatch({
          type: INDEX_ALBUMS_BY_NAME_SUCCESS,
          mangoIndex: mangoIndex
        })
        return mangoIndex
      }).catch(fetchError => { throw new Error(fetchError.response.statusText) })
  }
}

// Returns existing albums having given name
export const checkExistingAlbumsByName = (name = null, mangoIndex = null) => {
  return async (dispatch) => {
    try {
      mangoIndex = mangoIndex || await createAlbumMangoIndex()(dispatch)
    } catch (error) {
      throw error
    }

    return await cozy.query(mangoIndex, {
      selector: { name: name },
      fields: ['_id']
    }).catch(fetchError => {
      throw new Error(fetchError.response.statusText)
    })
  }
}

// Temporary parameter photos
export const createAlbum = (name = null, mangoIndex = null, photos = []) => {
  return async dispatch => {
    if (!name) {
      let error = 'Albums.create.error.name_missing'
      dispatch({
        type: CREATE_ALBUM_FAILURE,
        error: error
      })
      return Promise.reject(error)
    }

    dispatch({
      type: CREATE_ALBUM,
      name: name
    })

    return await checkExistingAlbumsByName(name, mangoIndex)(dispatch)
      .then(existingAlbums => {
        if (existingAlbums.length) {
          let error = 'Albums.create.error.already_exists'
          dispatch({
            type: CREATE_ALBUM_FAILURE,
            error: error
          })
          return Promise.reject(error)
        }

        return cozy.create(ALBUM_DOCTYPE, { name: name })
          .catch(fetchError => { throw new Error(fetchError.response.statusText) })
          .then(album => {
            dispatch({
              type: CREATE_ALBUM_SUCCESS,
              album: album
            })
            return album
          })
      }).catch(error => {
        dispatch({
          type: CREATE_ALBUM_FAILURE,
          error: error
        })
        return Promise.reject(error)
      })
  }
}
