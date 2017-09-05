const MAKE_AVAILABLE_OFFLINE = 'MAKE_AVAILABLE_OFFLINE'
const UNDO_MAKE_AVAILABLE_OFFLINE = 'UNDO_MAKE_AVAILABLE_OFFLINE'

export default (state = [], action = {}) => {
  switch (action.type) {
    case MAKE_AVAILABLE_OFFLINE:
      return [...state, action.id]
    case UNDO_MAKE_AVAILABLE_OFFLINE:
      const index = state.indexOf(action.id)
      return [
        ...state.slice(0, index),
        ...state.slice(index + 1)
      ]
    default:
      return state
  }
}

export const makeAvailableOffline = (id) => ({ type: MAKE_AVAILABLE_OFFLINE, id })
export const undoMakeAvailableOffline = (id) => ({ type: UNDO_MAKE_AVAILABLE_OFFLINE, id })

export const isAvailableOffline = ({availableOffline: state}) => (id) => state.indexOf(id) !== -1
