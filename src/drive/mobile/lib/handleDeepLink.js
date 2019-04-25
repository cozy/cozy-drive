const PROTOCOL = 'cozydrive://'
const UNIVERSALLINK_URL = 'https://universal-link.cozycloud.cc/'
const CustomSchemeRegex = new RegExp('^' + PROTOCOL)
const UniversalLinkRegex = new RegExp(`^${UNIVERSALLINK_URL}drive/`)
require('url-polyfill')
import { setOnboarding } from '../modules/authorization/duck'

export const handleDeeplink = (history, store, url) => {
  const path = generateRoute(url)
  history.replace('/' + path)
  if (path.includes('auth?')) {
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

const generateRoute = url => {
  const urlObj = new URL(url)
  //remove fallback params
  if (urlObj.searchParams.has('fallback')) {
    urlObj.searchParams.delete('fallback')
  }
  let newUrl = urlObj.toString()
  let path = ''
  if (newUrl.startsWith('http')) {
    path = newUrl.replace(UniversalLinkRegex, '')
  } else {
    path = newUrl.replace(CustomSchemeRegex, '')
  }
  return path
}
