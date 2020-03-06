import { combineReducers } from 'redux'

import modalReducer from './ModalManager'

export default combineReducers({ modal: modalReducer })

export { ModalManager, showModal } from './ModalManager'

export { default as getQueryParameter } from './QueryParameter'
