import get from 'lodash/get'

const SHOW_NEW_FOLDER_INPUT = 'SHOW_NEW_FOLDER_INPUT'
const HIDE_NEW_FOLDER_INPUT = 'HIDE_NEW_FOLDER_INPUT'

export const showNewFolderInput = () => ({
  type: SHOW_NEW_FOLDER_INPUT
})

export const hideNewFolderInput = () => ({
  type: HIDE_NEW_FOLDER_INPUT
})

const initialState = {
  isTypingNewFolderName: false
}

const filelist = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_NEW_FOLDER_INPUT:
      return { ...state, isTypingNewFolderName: true }
    case HIDE_NEW_FOLDER_INPUT:
      return { ...state, isTypingNewFolderName: false }
    default:
      return state
  }
}

export default filelist

export const isTypingNewFolderName = state =>
  state.filelist.isTypingNewFolderName

export const isThereFileWithThisMetadata = ({ files, attribute }) => {
  return (
    files &&
    files.length > 0 &&
    files.some(file => get(file, `metadata.${attribute}`))
  )
}
