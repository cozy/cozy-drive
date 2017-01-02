import { FETCH_FILES, RECEIVE_FILES } from '../actions'

const initialState = {
  loading: false,
  displayedFiles: []
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FILES:
      return Object.assign({}, state, {
        loading: true
      })
    case RECEIVE_FILES:
      return Object.assign({}, state, {
        loading: false,
        displayedFiles: formatStatsForDisplay(action.folder)
      })
    default:
      return state
  }
}

export default ui

const formatStatsForDisplay = (folder) => {
  return folder.relations('contents').map(c => Object.assign({},
    c.attributes
  ))
}
