export { default as CozyProvider } from './CozyProvider'
export { default as CozyClient } from './CozyClient'
export { default as cozyConnect } from './connect'
export { default as cozyMiddleware } from './middleware'
export {
  default as reducer,
  makeActionCreator,
  fetchCollection,
  fetchDocument,
  fetchReferencedFiles,
  addReferencedFiles,
  removeReferencedFiles,
  applySelectorForAction,
  enhancePropsForActions,
  getCollection,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  createFile,
  trashFile,
  CREATE_DOCUMENT
} from './reducer'
export {
  fetchSharings,
  fetchContacts,
  getSharingDetails,
  share,
  unshare,
  leave,
  shareByLink,
  revokeLink
} from './slices/sharings'
export { startSync, isFirstSync, isSynced } from './slices/synchronization'

export { downloadArchive, downloadFile } from './helpers'
