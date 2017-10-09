import { PRE_UPLOAD_FILE } from '../actions'

const CATEGORY = {
  INTERACTION: 'interaction'
}

const ACTIONS = {
  UPLOAD: 'upload'
}

const tracker = store => next => action => {
  switch (action.type) {
    case PRE_UPLOAD_FILE:
      action.trackEvent = {
        category: CATEGORY.INTERACTION,
        action: ACTIONS.UPLOAD,
        name: 'file',
        value: action.count
      }
      break
    default:
      break
  }

  return next(action)
}

export default tracker
