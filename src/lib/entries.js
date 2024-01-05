/**
 * Get type from the entries
 * @param {IOCozyFile[]} entries - List of files moved
 * @returns {string} - Type from the entries
 */
export const getEntriesType = entries => {
  const types = entries.reduce((acc, entry) => {
    acc.add(entry.type)
    return acc
  }, new Set())

  if (types.size === 1 && types.has('directory')) {
    return 'directory'
  }

  if (types.size === 1 && types.has('file')) {
    return 'file'
  }

  return 'element'
}

/**
 * Get translated type from the entries
 * @param {IOCozyFile[]} entries - List of files
 * @param {Function} t - Translation function
 * @returns {string} - Translated type from the entries
 */
export const getEntriesTypeTranslated = (t, entries) => {
  const type = getEntriesType(entries)
  return t(`EntriesType.${type}`, entries.length)
}
