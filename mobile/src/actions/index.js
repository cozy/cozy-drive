import { OPEN_FILE_E_OFFLINE, OPEN_FILE_E_NO_APP } from '../../../src/actions'

export const INIT_STATE = 'INIT_STATE'
export const initializeState = () => ({ type: INIT_STATE })

export const OPEN_WITH_OFFLINE_ERROR = 'mobile.error.open_with.offline'
export const OPEN_WITH_NO_APP_ERROR = 'mobile.error.open_with.noapp'
export const createError = (type, msg) => ({type: type, alert: { message: msg, level: 'error' }})
export const openWithOfflineError = () => createError(OPEN_FILE_E_OFFLINE, OPEN_WITH_OFFLINE_ERROR)
export const openWithNoAppError = () => createError(OPEN_FILE_E_NO_APP, OPEN_WITH_NO_APP_ERROR)
