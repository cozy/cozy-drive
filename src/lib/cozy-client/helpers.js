/* global cozy */
import omit from 'lodash/omit'
import { retry } from './utils'

const slugify = text =>
  text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

const forceFileDownload = (href, filename) => {
  const element = document.createElement('a')
  element.setAttribute('href', href)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

// async helpers: they interact with the stack but not with the store
export const downloadArchive = async (notSecureFilename, fileIds) => {
  const filename = slugify(notSecureFilename)
  const href = await cozy.client.files.getArchiveLinkByIds(fileIds, filename)
  const fullpath = await cozy.client.fullpath(href)
  forceFileDownload(fullpath, filename + '.zip')
}

export const downloadFile = async file => {
  const response = await cozy.client.files.downloadById(file.id)
  const blob = await response.blob()
  forceFileDownload(window.URL.createObjectURL(blob), file.name)
}

export const getDownloadLink = file =>
  cozy.client.files
    .getDownloadLinkById(file.id)
    .then(path => `${cozy.client._url}${path}`)

/**
 * Compute fields that should be indexed for a mango
 * query to work
 *
 * @param  {Object} query - Mango query
 * @return {Array} - Fields that should be indexed for this query to work
 */
export const getIndexFields = query => {
  const { selector, sort } = query
  if (sort) {
    // We filter possible duplicated fields
    return [...Object.keys(selector), ...Object.keys(sort)].filter(
      (f, i, arr) => arr.indexOf(f) === i
    )
  }
  return Object.keys(selector)
}

/** Remove special fields */
export const sanitizeDoc = doc => {
  return omit(doc, ['_type', 'id'])
}

export const isV2 = url =>
  retry(() => fetch(`${url}/status/`), 3)()
    .then(res => {
      if (!res.ok) {
        throw new Error('Could not fetch cozy status')
      } else {
        return res.json()
      }
    })
    .then(status => {
      const version = status.datasystem !== undefined ? 2 : 3
      return version === 2
    })
