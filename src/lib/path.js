/**
 * Join two paths together ensuring there is only one slash between them
 * @param {string} start
 * @param {string} end
 * @returns
 */
export function joinPath(start, end) {
  return `${start}${start.endsWith('/') ? '' : '/'}${end}`
}

/**
 * Get the parent folder path from a given path
 * @param {string} path The path to get the parent folder from
 * @returns {string|undefined} The path of the parent folder or undefined if the path is the root folder
 */
export const getParentPath = path => {
  if (path === '/') return undefined
  const parts = path.split('/')
  parts.pop()
  return parts.length === 1 ? '/' : parts.join('/')
}
