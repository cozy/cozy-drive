import { models } from 'cozy-client'

import { getIconUrl } from 'drive/web/modules/search/components/iconContext.js'
import FuzzyPathSearch from 'drive/lib/FuzzyPathSearch.js'
import { makeOnlyOfficeFileRoute } from 'drive/web/modules/views/OnlyOffice/helpers'
import { ROOT_DIR_ID } from 'drive/constants/config'

export const TYPE_DIRECTORY = 'directory'

export const normalizeString = str =>
  str
    .toString()
    .toLowerCase()
    .replace(/\//g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')

/**
 * Normalize file for Front usage in <AutoSuggestion> component inside <BarSearchAutosuggest>
 *
 * To reduce API call, the fetching of Note URL has been delayed
 * inside an onSelect function called only if provided to <BarSearchAutosuggest>
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

  let path, url, onSelect, parentUrl
  if (isDir) {
    path = file.path
    url = urlToFolder
    parentUrl = urlToFolder
  } else {
    const parentDir = folders.find(folder => folder._id === file.dir_id)
    path = parentDir && parentDir.path ? parentDir.path : ''
    parentUrl =
      parentDir && parentDir._id
        ? `${window.location.origin}/#/folder/${parentDir._id}`
        : ''
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
    parentUrl,
    icon: getIconUrl(file)
  }
}

/**
 * Fetches all files without trashed and preloads FuzzyPathSearch
 *
 * Using _all_docs route
 *
 * Also, this method:
 * - removing trashed data directly
 * - removes orphan file
 * - normalize file to match <SearchBar> expectation
 * - preloads FuzzyPathSearch
 *
 * @returns {Promise<void>} nothing
 */
export const indexFiles = async client => {
  const resp = await client
    .getStackClient()
    .fetchJSON(
      'GET',
      '/data/io.cozy.files/_all_docs?Fields=_id,trashed,dir_id,name,path,type,mime,class,metadata.title,metadata.version&DesignDocs=false&include_docs=true'
    )
  const files = resp.rows.map(row => ({ id: row.id, ...row.doc }))
  const folders = files.filter(file => file.type === TYPE_DIRECTORY)

  const notInTrash = file => !file.trashed && !/^\/\.cozy_trash/.test(file.path)
  const notOrphans = file =>
    folders.find(folder => folder._id === file.dir_id) !== undefined
  const notRoot = file => file._id !== ROOT_DIR_ID

  const normalizedFilesPrevious = files.filter(
    file => notInTrash(file) && notOrphans(file) && notRoot(file)
  )

  const normalizedFiles = normalizedFilesPrevious.map(file =>
    makeNormalizedFile(client, folders, file)
  )

  return new FuzzyPathSearch(normalizedFiles)
}

/**
 * Open the page corresponding to onSelect
 *
 * @param {*} client - The CozyClient instance
 * @param {*} onSelect - is a string that describes what should happen when the suggestion is selected. Currently, the only format we're supporting is `open:http://example.com` to change the url of the current page.
 */
export const openOnSelect = async (client, onSelect) => {
  if (/^id_note:/.test(onSelect)) {
    const url = await models.note.fetchURL(client, {
      id: onSelect.substr(8)
    })
    window.location.href = url
  } else if (/^open:/.test(onSelect)) {
    window.location.href = onSelect.substr(5)
  } else {
    // eslint-disable-next-line no-console
    console.log('suggestion onSelect (' + onSelect + ') could not be executed')
  }
}
