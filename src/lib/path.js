/**
 * Join two paths together ensuring there is only one slash between them
 * @param {string} start
 * @param {string} end
 * @returns
 */
export function joinPath(start, end) {
  return `${start}${start.endsWith('/') ? '' : '/'}${end}`
}
