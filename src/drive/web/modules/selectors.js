export const getCurrentFolderId = rootState => {
  return rootState.router.params.folderId
}

export const getCurrentFileId = rootState => {
  return rootState.router.params.fileId
}
