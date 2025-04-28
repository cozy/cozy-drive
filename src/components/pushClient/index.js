import get from 'lodash/get'

import CozyClient, { Q } from 'cozy-client'
import flag from 'cozy-flags'

export const DESKTOP_SOFTWARE_ID = 'github.com/cozy-labs/cozy-desktop'

export const isLinux = () =>
  window.navigator &&
  window.navigator.appVersion.indexOf('Win') === -1 &&
  window.navigator.appVersion.indexOf('Mac') === -1

export const isAndroid = () =>
  window.navigator.userAgent &&
  window.navigator.userAgent.indexOf('Android') >= 0

export const isIOS = () =>
  window.navigator.userAgent &&
  /iPad|iPhone|iPod/.test(window.navigator.userAgent)

export const DESKTOP_BANNER = 'desktop_banner'
export const NOVIEWER_DESKTOP_CTA = 'noviewer_desktop_cta'

export const isClientAlreadyInstalled = async client => {
  const query = {
    definition: Q('io.cozy.settings').getById('io.cozy.settings.clients'),
    options: {
      as: 'io.cozy.settings/io.cozy.settings.clients',
      fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000),
      singleDocData: true
    }
  }
  const { data } = await client.fetchQueryAndGetFromState(query)
  return Object.values(data).some(
    device => get(device, 'attributes.software_id') === DESKTOP_SOFTWARE_ID
  )
}

export const getDesktopAppDownloadLink = ({ t }) => {
  const desktopAppDownloadLinkFromFlag = flag('cozy.desktop-app-download-link')

  if (desktopAppDownloadLinkFromFlag) {
    return desktopAppDownloadLinkFromFlag
  } else if (isLinux()) {
    return t('Nav.link-client')
  } else {
    return t('Nav.link-client-desktop')
  }
}

export const getMobileAppDownloadLink = ({ t }) => {
  if (isIOS()) {
    return t('Nav.link-client-ios')
  } else if (isAndroid()) {
    return t('Nav.link-client-android')
  } else {
    return t('Nav.link-client')
  }
}
