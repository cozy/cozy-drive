/* global Piwik */
import {
  PRE_UPLOAD_FILE
} from '../actions'

const CATEGORY = {
  INTERACTION: 'interaction'
}

const ACTIONS = {
  UPLOAD: 'upload'
}

const piwik = store => next => action => {
  let event = null

  switch (action.type){
    case PRE_UPLOAD_FILE:
      event = {
        category: CATEGORY.INTERACTION,
        action: ACTIONS.UPLOAD,
        name: 'file',
        value: action.count
      }
      break;
    default:
      break;
  }

  if (event && event.category && event.action) {
    try {
      const tracker = Piwik.getTracker()
      tracker.trackEvent(event.category, event.action, event.name, event.value)
    }
    catch (err) { }
  }

  return next(action)
}

export default piwik
