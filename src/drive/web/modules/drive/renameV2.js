// constants

const START_RENAMING = 'START_RENAMING'
const ABORT_RENAMING = 'ABORT_RENAMING'

// reducers

const initialState = { file: null, name: null }
const renameReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_RENAMING:
      return { ...state, file: action.file, name: action.file.name }
    case ABORT_RENAMING:
      return initialState
    default:
      return state
  }
}
export default renameReducer

// selectors

export const isRenaming = state => state.rename !== initialState
export const getRenamingFile = state => state.rename.file
export const getUpdatedName = state => state.rename.name

// action creators sync

export const startRenaming = file => ({ type: START_RENAMING, file })
export const abortRenaming = () => ({ type: ABORT_RENAMING })

// action creators async

export const startRenamingAsync = file => async dispatch => {
  await dispatch(startRenaming(file))
}
