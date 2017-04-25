/* global cozy */

/**
  Mango index related features (cozy-stack)
**/

import {
  INDEX_FILES_BY_DATE,
  INDEX_FILES_BY_DATE_SUCCESS
} from '../constants/actionTypes'

import {
  FILE_DOCTYPE
} from '../constants/config'

// Mango: Index files by date (create if not existing) and get its informations
export const indexFilesByDate = () => {
  return async dispatch => {
    dispatch({ type: INDEX_FILES_BY_DATE })
    const fields = [ 'class', 'trashed', 'created_at' ]
    return await cozy.client.data.defineIndex(FILE_DOCTYPE, fields)
      .then((mangoIndexByDate) => {
        dispatch({
          type: INDEX_FILES_BY_DATE_SUCCESS,
          mangoIndexByDate
        })
        return mangoIndexByDate
      })
  }
}
