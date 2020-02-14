//!TODO Put this to cozy-client/models/files
import { generateWebLink } from 'cozy-client'

const FILE_TYPE = 'file'
const DIR_TYPE = 'directory'
export const ALBUMS_DOCTYPE = 'io.cozy.photos.albums'
export const isFile = file => file && file.type === FILE_TYPE
export const isDirectory = file => file && file.type === DIR_TYPE

export const isReferencedByAlbum = file => {
  if (
    file.relationships &&
    file.relationships.referenced_by &&
    file.relationships.referenced_by.data &&
    file.relationships.referenced_by.data.length > 0
  ) {
    const references = file.relationships.referenced_by.data
    for (const reference of references) {
      if (reference.type === ALBUMS_DOCTYPE) {
        return true
      }
    }
  }
  return false
}
/**
 * Fetch and build an URL to open a note.
 * @param {Object} client CozyClient instance
 * @param {Object} file io.cozy.file object
 * @return {String} url
 */
export const fetchUrlToOpenANote = async (client, file) => {
  const {
    data: { note_id, subdomain, protocol, instance, sharecode, public_name }
  } = await client
    .getStackClient()
    .collection('io.cozy.notes')
    .fetchURL({ _id: file.id })
  const searchParams = [['id', note_id]]
  if (sharecode) searchParams.push(['sharecode', sharecode])
  if (public_name) searchParams.push(['username', public_name])
  const pathname = sharecode ? '/public/' : ''
  const url = generateWebLink({
    cozyUrl: `${protocol}://${instance}`,
    searchParams,
    pathname,
    hash: `/n/${note_id}`,
    slug: 'notes',
    subDomainType: subdomain
  })
  return url
}
