/* global cozy */
import React from 'react'
import FuzzyPathSearch from '../FuzzyPathSearch'
import { withClient } from 'cozy-client'

import { TYPE_DIRECTORY, makeNormalizedFile } from './helpers'

class SuggestionProvider extends React.Component {
  componentDidMount() {
    const { intent } = this.props
    this.hasIndexFilesBeenLaunched = false

    // re-attach the message listener for the intent to receive the suggestion requests
    window.addEventListener('message', event => {
      if (event.origin !== intent.attributes.client) return null
      const { query, id } = event.data
      // sometimes we get messages with undefined query & id, no idea why
      if (query && id) {
        this.provideSuggestions(query, id, intent)
      }
    })
  }

  /**
   * Provide Suggestions to calling Intent
   *
   * This method called when intent provide query will indexFiles once
   * to fill FuzzyPathSearch. Then will re-post message to the intent
   * with updated search results containing `files` as `suggestions`
   * for SearchBar need.
   *
   *  ⚠️ For note file, we don't provide url to open, but onSelect method
   *  to be called on click. Less API calls expected. But a note will be opened
   *  slower. See helpers.js
   *
   * @param query - Query to find file
   * @param id
   * @param intent - Intent calling
   * @returns {Promise<void>} nothing
   */
  async provideSuggestions(query, id, intent) {
    if (!this.hasIndexFilesBeenLaunched) {
      this.hasIndexFilesBeenLaunched = true
      await this.indexFiles()
    }

    const searchResults = this.fuzzyPathSearch.search(query)

    window.parent.postMessage(
      {
        type: `intent-${intent._id}:data`,
        id,
        suggestions: searchResults.map(result => ({
          id: result.id,
          title: result.name,
          subtitle: result.path,
          term: result.name,
          onSelect: result.onSelect || 'open:' + result.url,
          icon: result.icon
        }))
      },
      intent.attributes.client
    )
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
  async indexFiles() {
    const { client } = this.props
    const resp = await cozy.client.fetchJSON(
      'GET',
      '/data/io.cozy.files/_all_docs?Fields=_id,trashed,dir_id,name,path,type,mime,metadata.title,metadata.version&DesignDocs=false'
    )
    const files = resp.rows.map(row => ({ id: row.id, ...row.doc }))
    const folders = files.filter(file => file.type === TYPE_DIRECTORY)

    const notInTrash = file =>
      !file.trashed && !/^\/\.cozy_trash/.test(file.path)
    const notOrphans = file =>
      folders.find(folder => folder._id === file.dir_id) !== undefined

    const normalizedFilesPrevious = files.filter(notInTrash && notOrphans)

    const normalizedFiles = normalizedFilesPrevious.map(file =>
      makeNormalizedFile(client, folders, file)
    )

    this.fuzzyPathSearch = new FuzzyPathSearch(normalizedFiles)
  }

  render() {
    return null
  }
}

export default withClient(SuggestionProvider)
