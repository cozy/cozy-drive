/* global Piwik */
import {
  ADD_TO_UPLOAD_QUEUE
} from '../ducks/upload'

const CATEGORY = {
  INTERACTION: 'interaction'
}

const ACTIONS = {
  UPLOAD: 'upload'
}

const piwik = store => next => action => {
  let event = null

  switch (action.type) {
    case ADD_TO_UPLOAD_QUEUE:
      event = {
        category: CATEGORY.INTERACTION,
        action: ACTIONS.UPLOAD,
        name: 'photo',
        value: action.files.length
      }
      break
    default:
      break
  }

  if (event && event.category && event.action) {
    try {
      const tracker = Piwik.getTracker()
      tracker.trackEvent(event.category, event.action, event.name, event.value)
    } catch (err) { }
  }

  return next(action)
}

export default piwik
