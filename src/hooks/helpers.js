import { ROOT_DIR_ID, TRASH_DIR_ID } from '@/constants/config'

/**
 * This helper function is used to change the location of the current window
 * This main purpose is to help for testing
 * @param {string} url - The url to change the location to
 */
export const changeLocation = url => {
  window.location = url
}

/**
 * Returns displayed folder or root folder if no display folder (like in recent or sharing)
 * or if trash folder
 * @param {object} displayedFolder
 * @returns {object}
 */
export const displayedFolderOrRootFolder = displayedFolder =>
  !displayedFolder || displayedFolder._id === TRASH_DIR_ID
    ? { id: ROOT_DIR_ID }
    : displayedFolder

/**
 * Check if targeted element can editable
 * @param {EventTarget | null} target
 * @returns {boolean}
 */
export const isEditableTarget = target =>
  target instanceof HTMLInputElement ||
  target instanceof HTMLTextAreaElement ||
  (target instanceof HTMLElement && target.isContentEditable)

/**
 * Normalize shortcut keys
 * @param {KeyboardEvent} event
 * @param {boolean} isApple
 * @returns {string}
 */
export const normalizeKey = (event, isApple) => {
  const keys = []

  if (isApple ? event.metaKey : event.ctrlKey) keys.push('Ctrl')
  keys.push(event.key.toLowerCase())
  return keys.join('+')
}
