import { pingOnceADay as pingOnceADayReporter } from '../lib/reporter'
import { getStore } from '../lib/store'

export const SET_TIMESTAMP = 'SET_TIMESTAMP'
export function pingOnceADay (timestamp = new Date().getTime()) {
  if (getStore().getState().mobile.settings.analytics) {
    const previousDate = new Date(timestamp)
    if (!isToday(previousDate)) {
      pingOnceADayReporter()
      return { type: SET_TIMESTAMP, timestamp: new Date().getTime() }
    }
  }
  return { type: SET_TIMESTAMP, timestamp }
}

function isToday (date) {
  const today = new Date()
  return (today.getFullYear() - date.getFullYear() === 0) &&
    (today.getMonth() - date.getMonth() === 0) &&
    (today.getDate() - date.getDate() === 0)
}
