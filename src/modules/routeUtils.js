export const getFolderPath = folderId => {
  return `/folder/${folderId}`
}

export const getViewerPath = (folderId, fileId) => {
  return `/folder/${folderId}/file/${fileId}`
}

export const getSharedDrivePath = (driveId, folderId) => {
  return `/shareddrive/${driveId}/${folderId}`
}

export const getSharedDriveViewerPath = (driveId, folderId, fileId) => {
  return `/shareddrive/${driveId}/${folderId}/file/${fileId}`
}
