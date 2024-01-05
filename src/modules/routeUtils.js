export const getFolderPath = folderId => {
  return `/folder/${folderId}`
}

export const getViewerPath = (folderId, fileId) => {
  return `/folder/${folderId}/file/${fileId}`
}
