import cozy from 'cozy-client-js'

export const COZY_PHOTOS_DIR_ID = 'io.cozy.files.root-dir'
export const TRASH_DIR_ID = 'io.cozy.files.trash-dir'
export const FILE_DOCTYPE = 'io.cozy.files'

// index using cozy-stack mango
export const DO_INDEX_FILES_BY_DATE = 'DO_INDEX_FILES_BY_DATE'
export const INDEX_FILES_BY_DATE_SUCCESS = 'INDEX_FILES_BY_DATE_SUCCESS'

// fetch photos
export const FETCH_PHOTOS = 'FETCH_PHOTOS'
export const RECEIVE_PHOTOS = 'RECEIVE_PHOTOS'
export const FETCH_PHOTOS_FAILURE = 'FETCH_PHOTOS_FAILURE'

// upload photos
export const UPLOAD_PHOTOS = 'UPLOAD_PHOTO'
export const UPLOAD_PHOTOS_SUCCESS = 'UPLOAD_PHOTOS_SUCCESS'
export const UPLOAD_PHOTOS_FAILURE = 'UPLOAD_PHOTOS_FAILURE'
export const UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS =
  'UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS'

import Alerter from '../components/Alerter'

const extractFileAttributes = f => Object.assign({}, f.attributes, { _id: f._id })

// Mango: Index files by date (create if not existing) and get its informations
export const indexFilesByDate = () => {
  return async dispatch => {
    dispatch({ type: DO_INDEX_FILES_BY_DATE })
    const fields = [ 'class', 'created_at' ]
    const mangoIndexByDate = await cozy.defineIndex(FILE_DOCTYPE, fields)
    dispatch({
      type: INDEX_FILES_BY_DATE_SUCCESS,
      mangoIndexByDate
    })
  }
}

// fetch images using the index created by the app
export const fetchPhotos = (mangoIndexByDate) => {
  return async dispatch => {
    dispatch({ type: FETCH_PHOTOS, mangoIndexByDate })
    const options = {
      selector: {
        class: 'image'
      },
      fields: ['_id', 'created_at', 'name', 'size', 'updated_at'],
      sort: [{ created_at: 'desc' }]
    }
    let photos
    try {
      photos = await cozy.query(mangoIndexByDate, options)
    } catch (error) {
      Alerter.error('Alerter.photos.fetching_error')
      return dispatch({type: FETCH_PHOTOS_FAILURE, error})
    }
    dispatch({
      type: RECEIVE_PHOTOS,
      photos
    })
  }
}

// Upload one or many photos
export const uploadPhotos = (photosArray, dirID = COZY_PHOTOS_DIR_ID) => {
  return async (dispatch) => {
    dispatch({ type: UPLOAD_PHOTOS })
    let photos = []
    let nameConflicts = []
    let errors = []
    await Promise.all(photosArray.map(async photo => {
      await cozy.files.create(
        photo,
        { dirID }
      )
      .then((photo) => {
        photos.push(extractFileAttributes(photo))
      })
      .catch((error) => {
        if (error.status === 409) {
          nameConflicts.push({
            url: error.url,
            detail: error.reason.errors[0]
          })
        } else {
          errors.push(error)
        }
      })
    }))
    .then(() => {
      if (!nameConflicts.length && !errors.length) {
        Alerter.success('Alerter.photos.upload_success')
        dispatch({
          type: UPLOAD_PHOTOS_SUCCESS,
          photos
        })
      } else if (nameConflicts.length && !errors.length) {
        Alerter.info(
          'Alerter.photos.upload_success_conflicts',
          {smart_count: nameConflicts.length}
        )
        dispatch({
          type: UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
          photos
        })
      } else {
        Alerter.error('Alerter.photos.upload_errors')
        dispatch({
          type: UPLOAD_PHOTOS_FAILURE,
          photos
        })
      }
    })
    .catch(() => {
      Alerter.info('Alert.photos.unexpected_upload_error')
      dispatch({
        type: UPLOAD_PHOTOS_FAILURE,
        photos
      })
    })
  }
}
