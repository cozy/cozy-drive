//!TODO Put this to cozy-client/models/files
import get from 'lodash/get'

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
 *
 * @param {object} file io.cozy.files
 * @param {object} client CozyClient instance
 * @return boolean If the file was created on my cozy
 */
export const isNoteMine = (file, client) => {
  const myCozyUrl = client.getStackClient().uri
  const noteCreatedOnCozy = get(file, 'cozyMetadata.createdOn')
  return noteCreatedOnCozy.startsWith(myCozyUrl)
}
