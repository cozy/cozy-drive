/* global cozy */
/**
  Albums related features
**/

import {
  ADD_TO_ALBUM,
  ADD_TO_ALBUM_SUCCESS,
  CANCEL_ADD_TO_ALBUM,
  CREATE_ALBUM_SUCCESS,
  FETCH_ALBUMS_SUCCESS,
  FETCH_CURRENT_ALBUM_PHOTOS,
  FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS,
  INDEX_ALBUMS_BY_NAME_SUCCESS
} from '../constants/actionTypes'

import {
  ALBUM_DOCTYPE
} from '../constants/config'

// helper to hanlde server error
export const throwServerError = (error) => {
  throw new Error(error.response
    ? error.response.statusText
    : error
  )
}

// Returns albums from the provided index
export const fetchAlbums = (mangoIndex) => {
  return async (dispatch) => {
    if (!mangoIndex) throw Error('Albums.fetchAlbums.error.index_missing')
    return await cozy.client.data.query(mangoIndex, {
      selector: {'name': {'$gt': null}},
      fields: ['_id', '_type', 'name']
    }).then(async albums => {
      for (let index in albums) {
        albums[index]._type = ALBUM_DOCTYPE // FIXME: this adds the missing _type to album
        albums[index].photosIds = await cozy.client.data.listReferencedFiles(albums[index])
          .then(photosIds => photosIds)
          .catch(fetchError => {
            throwServerError(fetchError)
          })
      }
      dispatch({type: FETCH_ALBUMS_SUCCESS, albums})
    }).catch(fetchError => {
      if (fetchError instanceof Error) throw fetchError
      throwServerError(fetchError)
    })
  }
}

// Returns albums photos informations from the album ID
export const fetchAlbumPhotosStatsById = (albumId) => {
  return async (dispatch) => {
    dispatch({type: FETCH_CURRENT_ALBUM_PHOTOS})
    try {
      let album = await cozy.client.data.find(ALBUM_DOCTYPE, albumId)
      const photosIds = await cozy.client.data.listReferencedFiles(album)
      let fetchedPhotos = []
      for (let index in photosIds) {
        const photo = await cozy.client.files.statById(photosIds[index])
        fetchedPhotos.push(Object.assign({}, photo, photo.attributes))
      }
      album.photos = fetchedPhotos
      dispatch({type: FETCH_CURRENT_ALBUM_PHOTOS_SUCCESS, album})
      return fetchedPhotos
    } catch (fetchError) {
      throwServerError(fetchError)
    }
  }
}

// create album
export const addToAlbum = (photos = [], album = null) => {
  return async dispatch => {
    if (!album) {
      return dispatch({
        type: ADD_TO_ALBUM,
        photos: photos
      })
    }

    return await cozy.client.data.addReferencedFiles(album, photos)
      .then(() => {
        dispatch({
          type: ADD_TO_ALBUM_SUCCESS,
          album: album
        })
        return album
      })
      .catch(fetchError => {
        throwServerError(fetchError)
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
    return cozy.client.data.defineIndex(ALBUM_DOCTYPE, ['name'])
      .then(mangoIndex => {
        dispatch({
          type: INDEX_ALBUMS_BY_NAME_SUCCESS,
          mangoIndex: mangoIndex
        })
        return mangoIndex
      }).catch(fetchError => {
        throwServerError(fetchError)
      })
  }
}

// Returns existing albums having given name
export const checkExistingAlbumsByName = (name = null, mangoIndex = null) => {
  return async (dispatch) => {
    try {
      mangoIndex = mangoIndex || await createAlbumMangoIndex()(dispatch)
    } catch (error) {
      throwServerError(error)
    }

    return await cozy.client.data.query(mangoIndex, {
      selector: { name: name },
      fields: ['_id']
    }).catch(fetchError => {
      throwServerError(fetchError)
    })
  }
}

// Temporary parameter photos
export const createAlbum = (name = null, mangoIndex = null, photos = []) => {
  return async dispatch => {
    if (!name) {
      let error = 'Albums.create.error.name_missing'
      return Promise.reject(error)
    }

    return await checkExistingAlbumsByName(name, mangoIndex)(dispatch)
      .then(existingAlbums => {
        if (existingAlbums.length) {
          let error = 'Albums.create.error.already_exists'
          return Promise.reject(error)
        }

        return cozy.client.data.create(ALBUM_DOCTYPE, { name: name })
          .then(album => {
            dispatch({
              type: CREATE_ALBUM_SUCCESS,
              album: album
            })
            return album
          })
          .catch(fetchError => {
            throwServerError(fetchError)
          })
      }).catch(error => {
        return Promise.reject(error)
      })
  }
}
