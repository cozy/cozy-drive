/* global cozy */
export const SHARINGS_DOCTYPE = 'io.cozy.sharings'

export const SHARED_BY_LINK = 'sharedByLink'
export const SHARED_WITH_ME = 'sharedWithMe'
export const SHARED_WITH_OTHERS = 'sharedWithOthers'

export default class SharingsCollection {
  // TODO: find a more standard arg list
  create(permissions, contactIds, sharingType, description) {
    const payload = {
      description,
      permissions,
      recipients: contactIds,
      sharing_type: sharingType
    }
    return cozy.client.fetchJSON('POST', '/sharings/', payload)
  }

  destroy(id) {
    return this.revoke(id)
  }

  async findByDoctype(doctype) {
    const permissions = await this.fetchSharingPermissions(doctype)
    const getSharingsURL = permission => permission.links.related
    const sharingURLs = [
      ...permissions.byMe.map(getSharingsURL),
      ...permissions.withMe.map(getSharingsURL)
    ]
    const sharings = await Promise.all(
      sharingURLs.map(url => this.fetchSharing(url))
    )
    return { permissions, sharings }
  }

  async fetchSharingPermissions(doctype) {
    const fetchPermissions = (doctype, sharingType) =>
      cozy.client
        .fetchJSON('GET', `/permissions/doctype/${doctype}/${sharingType}`)
        .catch(e => {
          console.error(e)
          return []
        })

    const byMe = await fetchPermissions(doctype, SHARED_WITH_OTHERS)
    const byLink = await fetchPermissions(doctype, SHARED_BY_LINK)
    const withMe = await fetchPermissions(doctype, SHARED_WITH_ME)
    return { byMe, byLink, withMe }
  }

  fetchSharing(url) {
    return cozy.client.fetchJSON('GET', url).catch(e => {
      console.error(e)
      return {}
    })
  }

  revoke(sharingId) {
    return cozy.client.fetchJSON('DELETE', `/sharings/${sharingId}`)
  }

  revokeForClient(sharingId, clientId) {
    return cozy.client.fetchJSON(
      'DELETE',
      `/sharings/${sharingId}/recipient/${clientId}`
    )
  }

  createLink(permissions) {
    return cozy.client.fetchJSON('POST', `/permissions?codes=email`, {
      data: {
        type: 'io.cozy.permissions',
        attributes: {
          permissions
        }
      }
    })
  }

  revokeLink(permissions) {
    return Promise.all(
      permissions.map(p =>
        cozy.client.fetchJSON('DELETE', `/permissions/${p._id}`)
      )
    )
  }
}
