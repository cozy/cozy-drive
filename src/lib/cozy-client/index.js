export { default as CozyProvider } from './CozyProvider'
export { default as CozyClient } from './CozyClient'
export { default as cozyConnect } from './connect'
export { default as cozyMiddleware } from './middleware'
export { default as withClient } from './withClient'
export {
  default as reducer,
  makeActionCreator,
  fetchCollection,
  refetchCollections,
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
  updateDocuments,
  deleteDocument,
  deleteDocuments,
  createFile,
  trashFile,
  CREATE_DOCUMENT
} from './reducer'
export {
  fetchSharings,
  fetchContacts,
  fetchApps,
  getSharings,
  getSharingDetails,
  getSharingLink,
  share,
  unshare,
  leave,
  shareByLink,
  revokeLink
} from './slices/sharings'
export {
  startSync,
  isFirstSync,
  isSynced,
  hasSyncStarted,
  isSyncInError
} from './slices/synchronization'

export { downloadArchive, downloadFile, getDownloadLink } from './helpers'
