import get from 'lodash/get'

import CozyClient, { Q } from 'cozy-client'

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
  const { data } = await client.query(
    Q('io.cozy.settings').getById('clients'),
    {
      as: 'io.cozy.settings/clients',
      fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
    }
  )
  return Object.values(data).some(
    device => get(device, 'attributes.software_id') === DESKTOP_SOFTWARE_ID
  )
}
