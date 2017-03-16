/* global cozy */

import { getFilteredPhotos, getBlob } from '../lib/media'
import { backupAllowed, getConnectionType } from '../lib/network'
import { setConnectionState } from '../actions/network'
import { HTTP_CODE_CONFLICT } from '../../../src/actions'

export const MEDIA_UPLOAD_START = 'MEDIA_UPLOAD_START'
export const MEDIA_UPLOAD_END = 'MEDIA_UPLOAD_END'
export const IMAGE_UPLOAD_SUCCESS = 'IMAGE_UPLOAD_SUCCESS'

export const startMediaUpload = () => ({ type: MEDIA_UPLOAD_START })
export const endMediaUpload = () => ({ type: MEDIA_UPLOAD_END })
export const successImageUpload = (image) => ({ type: IMAGE_UPLOAD_SUCCESS, id: image.id })

async function getDirID (dir) {
  const targetDirectory = await cozy.client.files.createDirectory({
    name: dir,
    dirID: 'io.cozy.files.root-dir'
  }).catch(err => {
    if (err.status === 409) { // directory already exists
      return cozy.client.files.statByPath(`/${dir}`)
    }
    throw err
  })
  return targetDirectory._id
}

export const mediaBackup = (dir) => async (dispatch, getState) => {
  const connectionType = getConnectionType()
  dispatch(setConnectionState(connectionType))
  if (backupAllowed(connectionType, getState().mobile.settings.wifiOnly)) {
    let photos = await getFilteredPhotos()
    const alreadyUploaded = getState().mobile.mediaBackup.uploaded
    const dirID = await getDirID(dir)
    for (let photo of photos) {
      if (!alreadyUploaded.includes(photo.id)) {
        const blob = await getBlob(photo)
        const options = {
          dirID,
          name: photo.fileName
        }
        await cozy.client.files.create(blob, options).then(() => {
          dispatch(successImageUpload(photo))
        }).catch(err => {
          if (err.status === HTTP_CODE_CONFLICT) {
            dispatch(successImageUpload(photo))
          }
          console.log(err)
        })
      }
    }
  }
}
