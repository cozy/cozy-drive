/* global Piwik */
import {
  UPLOAD_FILE
} from '../actions'

const CATEGORY = {
  BUTTONS: 'buttons'
}

const piwik = store => next => action => {
  let event = null

  switch (action.type){
    case UPLOAD_FILE:
      event = {
        category: CATEGORY.BUTTONS,
        action: 'upload'
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
