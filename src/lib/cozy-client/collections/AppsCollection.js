/* global cozy */
export const APPS_DOCTYPE = 'io.cozy.apps'

export default class AppsCollection {
  all() {
    return cozy.client.fetchJSON('GET', '/apps/').then(response => ({
      data: response.map(doc => ({ ...doc, id: doc._id }))
    }))
  }
}
