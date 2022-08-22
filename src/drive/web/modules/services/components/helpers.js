export const TYPE_DIRECTORY = 'directory'
const FILE_TYPE = 'file'

/**
 * Is file param a correct note
 *
 * Inspired by https://github.com/cozy/cozy-client/blob/b7ffdd97d017bbd52226e0b61099da3090d8253f/packages/cozy-client/src/models/file.js#L52
 * but don't check metadata (not provided while fetching Suggestions)
 *
 * @param {IOCozyFile} file io.cozy.files
 * @returns {boolean}
 */
export const isNote = file => {
  if (
    file &&
    file.name &&
    file.name.endsWith('.cozy-note') &&
    file.type === FILE_TYPE
  )
    return true
  return false
}

/**
 * Normalize file for Front usage in <AutoSuggestion> component inside <SearchBar>
 *
 * To reduce API call, the fetching of Note URL has been delayed
 * inside an onSelect function called only if provided to <SearchBar>
 * see https://github.com/cozy/cozy-drive/pull/2663#discussion_r938671963
 *
 * @param client - cozy client instance
 * @param folders - all the folders returned by API
 * @param file - file to normalize
 * @param getIconUrl - method to get icon url
 * @returns {{path: (*|string), name, icon, id, url: string, onSelect: (function(): Promise<string>)}} file with
 */
export const makeNormalizedFile = (client, folders, file, getIconUrl) => {
  const isDir = file.type === TYPE_DIRECTORY
  const dirId = isDir ? file._id : file.dir_id
  const urlToFolder = `${window.location.origin}/#/folder/${dirId}`

  let path, url, onSelect
  if (isDir) {
    path = file.path
    url = urlToFolder
  } else {
    const parentDir = folders.find(folder => folder._id === file.dir_id)
    path = parentDir && parentDir.path ? parentDir.path : ''
    if (isNote(file)) {
      onSelect = `id_note:${file.id}`
    } else {
      url = `${urlToFolder}/file/${file._id}`
    }
  }

  return {
    id: file._id,
    name: file.name,
    path,
    url,
    onSelect,
    icon: getIconUrl(file)
  }
}
