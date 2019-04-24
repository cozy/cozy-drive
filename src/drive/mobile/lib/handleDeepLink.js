const PROTOCOL = 'cozydrive://'
const UNIVERSALLINK_URL = 'https://universal-link.cozycloud.cc/'
const CustomSchemeRegex = new RegExp('^' + PROTOCOL)
const UniversalLinkRegex = new RegExp(`^${UNIVERSALLINK_URL}drive/`)
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
  let stripped = ''
  if (url.startsWith('http')) {
    stripped = url.replace(UniversalLinkRegex, '')
  } else {
    stripped = url.replace(CustomSchemeRegex, '')
  }

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
