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
  const query = {
    definition: Q('io.cozy.settings').getById('clients'),
    options: {
      as: 'io.cozy.settings/clients',
      fetchPolicy: CozyClient.fetchPolicies.olderThan(30 * 1000)
    }
  }
  const { data } = await client.fetchQueryAndGetFromState(query)
  return Object.values(data).some(
    device => get(device, 'attributes.software_id') === DESKTOP_SOFTWARE_ID
  )
}
