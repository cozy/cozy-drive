import cozy from 'cozy-client-js'

const ROOT_DIR_ID = 'io.cozy.files.root-dir'
export const FETCH_FILES = 'FETCH_FILES'
export const RECEIVE_FILES = 'RECEIVE_FILES'

export const fetchFiles = (folderId = ROOT_DIR_ID) => {
  return async dispatch => {
    dispatch({ type: FETCH_FILES })
    const folder = await cozy.files.statById(folderId)
    dispatch({ type: RECEIVE_FILES, folder })
  }
}
