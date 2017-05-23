// constants

export const SET_SAVE_FOLDER_BY_SLUG = 'SET_SAVE_FOLDER_BY_SLUG'
export const CREATE_SAVE_FOLDER_BY_SLUG_SUCCESS = 'CREATE_SAVE_FOLDER_BY_SLUG_SUCCESS'
const INIT_STATE = 'INIT_STATE'

// selectors

export const getFolderBySlug = (state, slug) => state.saveFolder.bySlug[slug] ? state.saveFolder.bySlug[slug].id : undefined

// reducers

const initialState = {}
const saveFolderBySlugReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SAVE_FOLDER_BY_SLUG:
    case CREATE_SAVE_FOLDER_SUCCESS:
      const folder = {}
      folder[action.slug] = action.folder
      return { ...state, folder }
    case INIT_STATE:
      return initialState
    default:
      return state
  }
}

// actions

const createdFolderSuccess = (slug, folder) => ({ type: CREATE_SAVE_FOLDER_BY_SLUG_SUCCESS, slug, folder })
const setFolderBySlug = (slug, folder) => ({ type: SET_SAVE_FOLDER_BY_SLUG, slug, folder })

// actions async

export const getOrCreateFolderBySlug = (slug, path) => async (dispatch, getState) => {
  const savedFolder = getFolderBySlug(getState(), slug)
  if (savedFolder) {
    return savedFolder
  }

  const createdFolder = await cozy.client.files.createDirectoryByPath(path)
  dispatch(createdFolderSuccess(slug, folder))

  return folder
}

export default saveFolderBySlugReducer
