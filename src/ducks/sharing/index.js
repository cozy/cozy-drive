/* global cozy */
export const filterSharedDocuments = (ids, doctype) =>
  findPermSets(ids, doctype).then(sets => sets.map(set => set.attributes.permissions.albums.values[0]))

export const findPermSet = (id, doctype) =>
  findPermSets([id], doctype).then(sets => sets.length === 0 ? undefined : sets[0])

// TODO: move this to cozy-client-js
// there is cozy.client.files.getCollectionShareLink already, but I think that
// there is a need of a bit of exploratory work and design for that API...

export const findPermSets = (ids, doctype) =>
  cozy.client.fetchJSON('GET', `/permissions/doctype/${doctype}/sharedByLink`)
    .then(sets => sets.filter(set => {
      const perm = set.attributes.permissions.albums
      return perm.type === doctype && ids.find(id => perm.values.indexOf(id) !== -1) !== undefined
    }))

export const createPermSet = (id, doctype) =>
  cozy.client.fetchJSON('POST', `/permissions?codes=email`, {
    data: {
      type: 'io.cozy.permissions',
      attributes: {
        permissions: {
          files: {
            type: 'io.cozy.files',
            verbs: ['GET'],
            values: [id],
            selector: 'referenced_by'
          },
          collection: {
            type: doctype,
            verbs: ['GET'],
            values: [id]
          }
        }
      }
    }
  })

export const deletePermSet = (setId) =>
  cozy.client.fetchJSON('DELETE', `/permissions/${setId}`)

export const getShareLink = (id, perms) =>
  `${window.location.origin}/public?sharecode=${perms.attributes.codes.email}&id=${id}`

import ShareModal from './ShareModal'

export { ShareModal }
