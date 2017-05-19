/* global cozy */

// Return a link for the photo for download.
export const getPhotoLink = async (photoId) => {
  return await cozy.client.files.getDownloadLinkById(photoId)
    .then(path => `${cozy.client._url}${path}`)
}
