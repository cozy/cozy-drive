/* global cordova */
import { isCordova } from './device'
const hasPlugin = () =>
  isCordova() && cordova.plugins.notification.local !== undefined

export const scheduleNotification = options => {
  if (hasPlugin()) cordova.plugins.notification.local.schedule(options)
}
