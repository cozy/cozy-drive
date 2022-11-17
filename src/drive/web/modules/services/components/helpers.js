import { models } from 'cozy-client'
import { getIconUrl } from './iconContext'

import { makeOnlyOfficeFileRoute } from 'drive/web/modules/views/OnlyOffice/helpers'

export const TYPE_DIRECTORY = 'directory'

/**
 * Normalize file for Front usage in <AutoSuggestion> component inside <SearchBar>
 *
 * To reduce API call, the fetching of Note URL has been delayed
 * inside an onSelect function called only if provided to <SearchBar>
 * see https://github.com/cozy/cozy-drive/pull/2663#discussion_r938671963
 *
 * @param {CozyClient} client - cozy client instance
 * @param {[IOCozyFile]} folders - all the folders returned by API
 * @param {IOCozyFile} file - file to normalize
 * @returns file with normalized field to be used in AutoSuggestion
 */
export const makeNormalizedFile = (client, folders, file) => {
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
    if (models.file.isNote(file)) {
      onSelect = `id_note:${file.id}`
    } else if (models.file.shouldBeOpenedByOnlyOffice(file)) {
      url = makeOnlyOfficeFileRoute(file)
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
