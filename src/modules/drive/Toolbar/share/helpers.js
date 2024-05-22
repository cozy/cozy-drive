import { joinPath } from 'lib/path'

/**
 * Get the path to share the displayed folder
 * @param {string} pathname Current path
 * @returns Next path
 */
export function getPathToShareDisplayedFolder(pathname) {
  return joinPath(pathname, 'share')
}
