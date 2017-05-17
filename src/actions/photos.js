/* global cozy */

/**
  Photos related features
**/

import {
  COZY_PHOTOS_DIR_ID
} from '../constants/config'

import {
  UPLOAD_PHOTOS,
  UPLOAD_PHOTOS_SUCCESS,
  UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
  UPLOAD_PHOTOS_FAILURE
} from '../constants/actionTypes'

import { addPhotosToTimeline } from '../ducks/timeline'

import Alerter from '../components/Alerter'

// used after photo upload (for photo format from response)
export const extractFileAttributes = f => Object.assign({}, f, f.attributes)

// Upload one or many photos
export const uploadPhotos = (files, dirID = COZY_PHOTOS_DIR_ID) => {
  return async (dispatch) => {
    dispatch({ type: UPLOAD_PHOTOS })
    let photos = []
    let nameConflicts = []
    let errors = []
    for (let file of files) {
      try {
        const uploadedFile = await cozy.client.files.create(file, { dirID })
        photos.push(extractFileAttributes(uploadedFile))
      } catch (error) {
        if (error.status === 409) {
          nameConflicts.push({
            url: error.url,
            detail: error.reason.errors[0]
          })
        } else {
          errors.push(error)
        }
      }
    }

    if (!nameConflicts.length && !errors.length) {
      Alerter.success(
        'Alerter.photos.upload_success',
        {smart_count: photos.length}
      )
      dispatch({
        type: UPLOAD_PHOTOS_SUCCESS,
        photos
      })
      dispatch(addPhotosToTimeline(photos))
    } else if (nameConflicts.length && !errors.length) {
      Alerter.info(
        'Alerter.photos.upload_success_conflicts',
        {smart_count: photos.length, conflictNumber: nameConflicts.length}
      )
      dispatch({
        type: UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS,
        photos
      })
      dispatch(addPhotosToTimeline(photos))
    } else {
      Alerter.error('Alerter.photos.upload_errors')
      dispatch({
        type: UPLOAD_PHOTOS_FAILURE,
        photos
      })
    }
  }
}

// Return a link for the photo for download.
export const getPhotoLink = async (photoId) => {
  return await cozy.client.files.getDownloadLinkById(photoId)
    .then(path => `${cozy.client._url}${path}`)
}
