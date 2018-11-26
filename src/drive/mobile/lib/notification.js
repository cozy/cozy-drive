/* global cordova */
import { isMobileApp } from 'cozy-device-helper'

const hasPlugin = () =>
  isMobileApp() && cordova.plugins.notification.local !== undefined

export const scheduleNotification = options => {
  if (hasPlugin()) cordova.plugins.notification.local.schedule(options)
}
