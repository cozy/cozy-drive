//!TODO Put this to cozy-client/models/files

import has from 'lodash/has'

const FILE_TYPE = 'file'
const DIR_TYPE = 'directory'
export const ALBUMS_DOCTYPE = 'io.cozy.photos.albums'
export const isFile = file => file && file.type === FILE_TYPE

/**
 * Whether the file should be opened by only office
 * We want to be consistent with the stack so we check the class attributes
 * But we want to exclude .txt and .md because the Viewer can already show them
 * @param {object} file - io.cozy.file document
 * @returns {boolean}
 */
export const shouldBeOpenedByOnlyOffice = file =>
  !file.name.endsWith('.txt') &&
  !file.name.endsWith('.md') &&
  (file.class === 'text' ||
    file.class === 'spreadsheet' ||
    file.class === 'slide')

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
 * Whether the file's metadata attribute exists
 * @param {object} params - Param
 * @param {object} params.file - An io.cozy.files document
 * @param {string} params.attribute - Metadata attribute to check
 */
export const hasMetadataAttribute = ({ file, attribute }) =>
  has(file, `metadata.${attribute}`)
