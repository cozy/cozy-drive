export function onWifi () {
  return window.navigator.connection && window.navigator.connection.type === window.Connection.WIFI
}
