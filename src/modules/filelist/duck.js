const SHOW_NEW_FOLDER_INPUT = 'SHOW_NEW_FOLDER_INPUT'
const HIDE_NEW_FOLDER_INPUT = 'HIDE_NEW_FOLDER_INPUT'
const IS_ENCRYPTED_FILE = 'IS_ENCRYPTED_FILE'

export const showNewFolderInput = () => ({
  type: SHOW_NEW_FOLDER_INPUT
})

export const hideNewFolderInput = () => ({
  type: HIDE_NEW_FOLDER_INPUT
})

export const encryptedFolder = () => ({
  type: IS_ENCRYPTED_FILE
})

const initialState = {
  isTypingNewFolderName: false,
  isEncryptedFolder: false
}

const filelist = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NEW_FOLDER_INPUT:
      return { ...state, isTypingNewFolderName: true }
    case HIDE_NEW_FOLDER_INPUT:
      return { ...state, isTypingNewFolderName: false }
    case IS_ENCRYPTED_FILE:
      return { ...state, isEncryptedFolder: true }
    default:
      return state
  }
}

export default filelist

export const isTypingNewFolderName = state =>
  state.filelist.isTypingNewFolderName

export const isEncryptedFolder = state => state.filelist.isEncryptedFolder
