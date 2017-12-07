/* global cozy */
export const SHARINGS_DOCTYPE = 'io.cozy.sharings'

export const SHARED_BY_LINK = 'sharedByLink'
export const SHARED_WITH_ME = 'sharedWithMe'
export const SHARED_WITH_OTHERS = 'sharedWithOthers'

export default class SharingsCollection {
  // TODO: find a more standard arg list
  create(permissions, contactIds, sharingType, description) {
    return cozy.client.fetchJSON('POST', '/sharings/', {
      desc: description,
      permissions,
      recipients: contactIds.map(contactId => ({
        recipient: {
          id: contactId,
          type: 'io.cozy.contacts'
        }
      })),
      sharing_type: sharingType
    })
  }

  destroy(id) {
    return this.revoke(id)
  }

  async findByDoctype(doctype) {
    const permissions = await this.fetchSharingPermissions(doctype)
    const sharingIds = [
      ...permissions.byMe.map(p => p.attributes.source_id),
      ...permissions.withMe.map(p => p.attributes.source_id)
    ]
    const sharings = await Promise.all(
      sharingIds.map(id => this.fetchSharing(id))
    )
    return { permissions, sharings }
  }

  async fetchSharingPermissions(doctype) {
    const fetchPermissions = (doctype, sharingType) =>
      cozy.client.fetchJSON(
        'GET',
        `/permissions/doctype/${doctype}/${sharingType}`
      )

    // if we catch an exception (server's error), we init values with empty array
    const byMe = await fetchPermissions(doctype, SHARED_WITH_OTHERS).catch(
      () => []
    )
    const byLink = await fetchPermissions(doctype, SHARED_BY_LINK).catch(
      () => []
    )
    const withMe = await fetchPermissions(doctype, SHARED_WITH_ME).catch(
      () => []
    )
    return { byMe, byLink, withMe }
  }

  fetchSharing(id) {
    return cozy.client.fetchJSON('GET', `/sharings/${id}`).catch(() => ({}))
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

  revokeLink(permission) {
    return cozy.client.fetchJSON('DELETE', `/permissions/${permission._id}`)
  }
}
