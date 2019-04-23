const PROTOCOL = 'cozydrive://'
const RX = new RegExp('^' + PROTOCOL)
const RX2 = new RegExp('^' + 'http://universal-link.cozycloud.cc/drive/')
import { setOnboarding } from '../modules/authorization/duck'

export const handleDeeplink = (history, store, url) => {
  const stripped = url.replace(RX, '').replace(RX2, '')
  history.replace('/' + stripped)
  if (stripped.includes('auth?')) {
    const currentLocation = history.getCurrentLocation()
    const { code, state, cozy_url } = currentLocation.query
    store.dispatch(
      setOnboarding({
        code,
        state,
        cozy_url
      })
    )
  }
}
