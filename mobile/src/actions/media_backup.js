import cozy from 'cozy-client-js'
import { getPhotos, getBlob } from '../lib/media'

export const MEDIA_UPLOAD_START = 'MEDIA_UPLOAD_START'
export const MEDIA_UPLOAD_END = 'MEDIA_UPLOAD_END'

export const mediaBackup = () => async dispatch => {
  dispatch({ type: MEDIA_UPLOAD_START })
  let photos = await getPhotos()
  for (let photo of photos) {
    const blob = await getBlob(photo)
    const options = {
      dirID: 'io.cozy.files.root-dir',
      name: photo.filename
    }
    await cozy.files.create(blob, options).catch(err => {
      console.log(err)
    })
  }
  dispatch({ type: MEDIA_UPLOAD_END })
}
