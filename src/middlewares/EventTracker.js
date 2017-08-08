import { ADD_TO_UPLOAD_QUEUE } from '../ducks/upload'
import { DOCTYPE as DOCTYPE_ALBUM } from '../ducks/albums'
import { CREATE_DOCUMENT } from '../lib/redux-cozy-client'

const CATEGORY = {
  INTERACTION: 'interaction'
}

const ACTIONS = {
  UPLOAD: 'upload',
  CREATION: 'creation'
}

const tracker = store => next => action => {
  if (action.type === ADD_TO_UPLOAD_QUEUE) {
    action.trackEvent = {
      category: CATEGORY.INTERACTION,
      action: ACTIONS.UPLOAD,
      name: 'photo',
      value: action.files.length
    }
  } else if (action.type === CREATE_DOCUMENT && action.document && action.document.type && action.document.type === DOCTYPE_ALBUM) {
    action.trackEvent = {
      category: CATEGORY.INTERACTION,
      action: ACTIONS.CREATION,
      name: 'album',
      value: 1
    }
  }

  return next(action)
}

export default tracker
