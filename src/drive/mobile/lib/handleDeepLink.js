const PROTOCOL = 'cozydrive://'
const RX = new RegExp('^' + PROTOCOL)
const RX2 = new RegExp('^' + 'http://universal-link.cozycloud.cc/drive/')
import { setOnboarding } from '../modules/authorization/duck'

export const handleDeeplink = (history, store, url) => {
  /*
  let's remove redirect params. It's only needed for universal link
  if we arrive at this stage, we don't need it anymore
  */
  let route = new URL(url)

  if (route.searchParams.has('redirect')) {
    route.searchParams.delete('redirect')
  }
  const stripped = route.toString().replace(RX, '')

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
