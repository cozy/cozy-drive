import {
  ADD_TO_UPLOAD_QUEUE
} from '../ducks/upload'

const CATEGORY = {
  INTERACTION: 'interaction'
}

const ACTIONS = {
  UPLOAD: 'upload'
}

const tracker = store => next => action => {
  switch (action.type) {
    case ADD_TO_UPLOAD_QUEUE:
      action.trackEvent = {
        category: CATEGORY.INTERACTION,
        action: ACTIONS.UPLOAD,
        name: 'photo',
        value: action.files.length
      }
      break
    default:
      break
  }

  return next(action)
}

export default tracker
