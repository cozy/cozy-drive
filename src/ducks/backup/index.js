import { combineReducers } from 'redux'
import saveFolderReducer from './saveFolder'

export default combineReducers({
  folders: saveFolderReducer
})
