import { OPEN_FILE_E_OFFLINE, OPEN_FILE_E_NO_APP } from '../../../actions'

export const OPEN_WITH_OFFLINE_ERROR = 'mobile.error.open_with.offline'
export const OPEN_WITH_NO_APP_ERROR = 'mobile.error.open_with.noapp'
export const createError = (type, msg, meta = {}) => ({type: type, alert: { message: msg, level: 'error' }, meta})
export const openWithOfflineError = meta => createError(OPEN_FILE_E_OFFLINE, OPEN_WITH_OFFLINE_ERROR, meta)
export const openWithNoAppError = meta => createError(OPEN_FILE_E_NO_APP, OPEN_WITH_NO_APP_ERROR, meta)
