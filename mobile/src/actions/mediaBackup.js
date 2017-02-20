import cozy from 'cozy-client-js'
import { getPhotos, getBlob } from '../lib/media'
import { HTTP_CODE_CONFLICT } from '../../../src/actions'

export const MEDIA_UPLOAD_START = 'MEDIA_UPLOAD_START'
export const MEDIA_UPLOAD_END = 'MEDIA_UPLOAD_END'
export const IMAGE_UPLOAD_SUCCESS = 'IMAGE_UPLOAD_SUCCESS'

export const startMediaUpload = () => ({ type: MEDIA_UPLOAD_START })
export const endMediaUpload = () => ({ type: MEDIA_UPLOAD_END })
export const successImageUpload = (image) => ({ type: IMAGE_UPLOAD_SUCCESS, id: image.id })

export const mediaBackup = () => async (dispatch, getState) => {
  dispatch(startMediaUpload())
  let photos = await getPhotos()
  const alreadyUploaded = getState().mobile.mediaBackup.uploaded
  for (let photo of photos) {
    if (!alreadyUploaded.includes(photo.id)) {
      const blob = await getBlob(photo)
      const options = {
        dirID: 'io.cozy.files.root-dir',
        name: photo.filename
      }
      await cozy.files.create(blob, options).then(() => {
        dispatch(successImageUpload(photo))
      }).catch(err => {
        if (err.status === HTTP_CODE_CONFLICT) {
          dispatch(successImageUpload(photo))
        }
        console.log(err)
      })
    }
  }
  dispatch(endMediaUpload())
}
