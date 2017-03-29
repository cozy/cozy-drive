import { pingOnceADay as pingOnceADayReporter } from '../lib/reporter'

export const SET_TIMESTAMP = 'SET_TIMESTAMP'

export const pingOnceADay = (timestamp = new Date().getTime()) => (dispatch, getState) => {
  if (getState().mobile.settings.analytics) {
    const previousDate = new Date(timestamp)
    if (!isToday(previousDate)) {
      pingOnceADayReporter()
      return dispatch({ type: SET_TIMESTAMP, timestamp: new Date().getTime() })
    }
  }
  return dispatch({ type: SET_TIMESTAMP, timestamp })
}

function isToday (date) {
  const today = new Date()
  return (today.getFullYear() - date.getFullYear() === 0) &&
    (today.getMonth() - date.getMonth() === 0) &&
    (today.getDate() - date.getDate() === 0)
}
