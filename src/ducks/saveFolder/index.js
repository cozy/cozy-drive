/* global cozy */
import { combineReducers } from 'redux'

// constants

export const SET_SAVE_FOLDER_BY_SLUG = 'SET_SAVE_FOLDER_BY_SLUG'
export const CREATE_SAVE_FOLDER_BY_SLUG_SUCCESS = 'CREATE_SAVE_FOLDER_BY_SLUG_SUCCESS'
const INIT_STATE = 'INIT_STATE'

// selectors

export const getFolderBySlug = (state, slug) => state.saveFolder.slugs[slug] ? state.saveFolder.slugs[slug] : undefined

// reducers

const saveFolderBySlugReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SAVE_FOLDER_BY_SLUG:
    case CREATE_SAVE_FOLDER_BY_SLUG_SUCCESS:
      delete action.folder.relations // it's not possible to serialize function
      return { ...state, [action.slug]: action.folder }
    case INIT_STATE:
      return {}
    default:
      return state
  }
}

// actions

const createdFolderSuccess = (slug, folder) => ({ type: CREATE_SAVE_FOLDER_BY_SLUG_SUCCESS, slug, folder })
// const setFolderBySlug = (slug, folder) => ({ type: SET_SAVE_FOLDER_BY_SLUG, slug, folder })

// actions async

export const createFolderBySlug = (slug, path) => async (dispatch, getState) => {
  const folder = await cozy.client.files.createDirectoryByPath(path)
  dispatch(createdFolderSuccess(slug, folder))

  return folder
}

export const getOrCreateFolderBySlug = (slug, path) => async (dispatch, getState) => {
  const folder = getFolderBySlug(getState(), slug)
  if (folder) {
    return folder
  }

  return dispatch(createFolderBySlug(slug, path))
}

export default combineReducers({
  slugs: saveFolderBySlugReducer
})
