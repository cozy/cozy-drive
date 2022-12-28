import React from 'react'

import { models } from 'cozy-client'

import { getIconUrl } from 'drive/web/modules/services/components/iconContext.js'
import FuzzyPathSearch from 'drive/web/modules/services/FuzzyPathSearch.js'
import { makeOnlyOfficeFileRoute } from 'drive/web/modules/views/OnlyOffice/helpers'
import { ROOT_DIR_ID } from 'drive/constants/config'

export const TYPE_DIRECTORY = 'directory'

const normalizeString = str =>
  str
    .toString()
    .toLowerCase()
    .replace(/\//g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(' ')

/**
 * Add <b> on part that equls query into each result
 *
 * @param {Array} searchResult - list of results
 * @param {string} query - search input
 * @returns list of results with the query highlighted
 */
export const highlightQueryTerms = (searchResult, query) => {
  const normalizedQueryTerms = normalizeString(query)
  const normalizedResultTerms = normalizeString(searchResult)

  const matchedIntervals = []
  const spacerLength = 1
  let currentIndex = 0

  normalizedResultTerms.forEach(resultTerm => {
    normalizedQueryTerms.forEach(queryTerm => {
      const index = resultTerm.indexOf(queryTerm)
      if (index >= 0) {
        matchedIntervals.push({
          from: currentIndex + index,
          to: currentIndex + index + queryTerm.length
        })
      }
    })

    currentIndex += resultTerm.length + spacerLength
  })

  // matchedIntervals can overlap, so we merge them.
  // - sort the intervals by starting index
  // - add the first interval to the stack
  // - for every interval,
  // - - add it to the stack if it doesn't overlap with the stack top
  // - - or extend the stack top if the start overlaps and the new interval's top is bigger
  const mergedIntervals = matchedIntervals
    .sort((intervalA, intervalB) => intervalA.from > intervalB.from)
    .reduce((computedIntervals, newInterval) => {
      if (
        computedIntervals.length === 0 ||
        computedIntervals[computedIntervals.length - 1].to < newInterval.from
      ) {
        computedIntervals.push(newInterval)
      } else if (
        computedIntervals[computedIntervals.length - 1].to < newInterval.to
      ) {
        computedIntervals[computedIntervals.length - 1].to = newInterval.to
      }

      return computedIntervals
    }, [])

  // create an array containing the entire search result, with special characters, and the intervals surrounded y `<b>` tags
  const slicedOriginalResult =
    mergedIntervals.length > 0
      ? [searchResult.slice(0, mergedIntervals[0].from)]
      : searchResult

  for (let i = 0, l = mergedIntervals.length; i < l; ++i) {
    slicedOriginalResult.push(
      <b>
        {searchResult.slice(mergedIntervals[i].from, mergedIntervals[i].to)}
      </b>
    )
    if (i + 1 < l)
      slicedOriginalResult.push(
        searchResult.slice(mergedIntervals[i].to, mergedIntervals[i + 1].from)
      )
  }

  if (mergedIntervals.length > 0)
    slicedOriginalResult.push(
      searchResult.slice(
        mergedIntervals[mergedIntervals.length - 1].to,
        searchResult.length
      )
    )

  return slicedOriginalResult
}

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
