import {
  SELECT_PHOTO,
  UNSELECT_PHOTO,
  SHOW_SELECTION_BAR,
  HIDE_SELECTION_BAR
} from '../constants/actionTypes'

export const showSelectionBar = () => ({
  type: SHOW_SELECTION_BAR
})

export const hideSelectionBar = () => ({
  type: HIDE_SELECTION_BAR
})

export const togglePhotoSelection = (id, selected) => ({
  type: selected ? UNSELECT_PHOTO : SELECT_PHOTO,
  id
})
