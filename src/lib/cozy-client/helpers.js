/* global cozy */

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
