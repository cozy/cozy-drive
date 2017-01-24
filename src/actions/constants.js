/**
  Redux constants
**/

// global variables
export const COZY_PHOTOS_DIR_ID = 'io.cozy.files.root-dir'
export const TRASH_DIR_ID = 'io.cozy.files.trash-dir'
export const FILE_DOCTYPE = 'io.cozy.files'

// index using cozy-stack mango
export const INDEX_FILES_BY_DATE = 'INDEX_FILES_BY_DATE'
export const INDEX_FILES_BY_DATE_SUCCESS = 'INDEX_FILES_BY_DATE_SUCCESS'

// fetch photos
export const FETCH_PHOTOS = 'FETCH_PHOTOS'
export const RECEIVE_PHOTOS = 'RECEIVE_PHOTOS'
export const FETCH_PHOTOS_FAILURE = 'FETCH_PHOTOS_FAILURE'

// upload photos
export const UPLOAD_PHOTOS = 'UPLOAD_PHOTOS'
export const UPLOAD_PHOTOS_SUCCESS = 'UPLOAD_PHOTOS_SUCCESS'
export const UPLOAD_PHOTOS_FAILURE = 'UPLOAD_PHOTOS_FAILURE'
export const UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS =
  'UPLOAD_PHOTOS_SUCCESS_WITH_CONFLICTS'
