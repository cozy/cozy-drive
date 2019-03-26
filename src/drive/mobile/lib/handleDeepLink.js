const PROTOCOL = 'cozydrive://'
const RX = new RegExp('^' + PROTOCOL)
import { setOnboarding } from '../modules/authorization/duck'

export const handleDeeplink = (history, store, url) => {
  const stripped = url.replace(RX, '')

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
