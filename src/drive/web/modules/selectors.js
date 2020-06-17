export const getCurrentFolderId = rootState => {
  if (rootState.router.params.folderId) {
    return rootState.router.params.folderId
  } else if (rootState.router.location.pathname == '/folder') {
    return 'io.cozy.files.root-dir'
  }
  return null
}

export const getCurrentFileId = rootState => {
  return rootState.router.params.fileId
}
