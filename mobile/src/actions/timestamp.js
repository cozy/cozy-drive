import { pingOnceADay as pingOnceADayReporter } from '../lib/reporter'

export const SET_TIMESTAMP = 'SET_TIMESTAMP'

export const pingOnceADay = (timestamp, analytics = false) => dispatch => {
  if (analytics) {
    if (!timestamp || !isToday(new Date(timestamp))) {
      pingOnceADayReporter()
      return dispatch({ type: SET_TIMESTAMP, timestamp: new Date().getTime() })
    }
  }
}

function isToday (date) {
  const today = new Date()
  return (today.getFullYear() - date.getFullYear() === 0) &&
    (today.getMonth() - date.getMonth() === 0) &&
    (today.getDate() - date.getDate() === 0)
}
