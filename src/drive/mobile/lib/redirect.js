import { getUniversalLinkDomain } from 'cozy-ui/transpiled/react/AppLinker'
import { isAndroidApp, isMobileApp } from 'cozy-device-helper'
import { PROTOCOL } from 'drive/mobile/lib/constants'

/**
  The redirect_uri is needed by the stack to redirect the user logged from the app (OAuth Client)
  
  We need to add a custom_scheme and custom_path search params in order to be able to 
  deal with an iOS bug during apple-app-site json file retrieving. (https://openradar.appspot.com/33893852)
  Since the json file is not downloaded, the device and the app don't know they have to 
  handle the universal link so we are redirected to the registry (the server behind the universalink domain)
  This server only does redirection. If we reach it, it redirects the client to the fallback_url which is 
  the web version of the app.

  But as we know that we are on the mobile app if we use this method, we add the custom_scheme to the 
  request. This way, if we reach the server, it can check if the url has the custom_scheme params and 
  instead of redirecting to the web version of the app, redirect to the native app via the custom scheme.
*/
export const getRedirectUri = appSlug => {
  // needed for our Drive standalone mode
  if (!isMobileApp()) return 'http://localhost'
  const redirectedPath = 'auth'
  return isAndroidApp()
    ? PROTOCOL + redirectedPath
    : getUniversalLinkDomain() +
        '/' +
        appSlug +
        `/${redirectedPath}?custom_scheme=${PROTOCOL}&custom_path=${redirectedPath}`
}
