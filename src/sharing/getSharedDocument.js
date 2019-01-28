import get from 'lodash/get'

const getSharedDocument = async client => {
  const { data: permissionsData } = await client
    .collection('io.cozy.permissions')
    .getOwnPermissions()

  const permissions = permissionsData.attributes.permissions
  // permissions contains several named keys, but the one to use depends on the situation. Using the first one is what we want in all known cases.
  const sharedDocumentId = get(Object.values(permissions), '0.values.0')

  return sharedDocumentId
}

export default getSharedDocument
