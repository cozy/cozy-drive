/* global cozy */
import React from 'react'
import FuzzyPathSearch from '../FuzzyPathSearch'
import { withClient } from 'cozy-client'

import { makeNormalizedFile, TYPE_DIRECTORY } from './helpers'
import { ROOT_DIR_ID } from 'drive/constants/config'

class SuggestionProvider extends React.Component {
  componentDidMount() {
    const { intent } = this.props
    this.hasIndexedFiles = false

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
    if (!this.hasIndexedFiles) {
      await this.indexFiles()
      this.hasIndexedFiles = true
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
      '/data/io.cozy.files/_all_docs?Fields=_id,trashed,dir_id,name,path,type,mime,class,metadata.title,metadata.version&DesignDocs=false&include_docs=true'
    )
    const files = resp.rows.map(row => ({ id: row.id, ...row.doc }))
    const folders = files.filter(file => file.type === TYPE_DIRECTORY)

    const notInTrash = file =>
      !file.trashed && !/^\/\.cozy_trash/.test(file.path)
    const notOrphans = file =>
      folders.find(folder => folder._id === file.dir_id) !== undefined
    const notRoot = file => file._id !== ROOT_DIR_ID

    const normalizedFilesPrevious = files.filter(
      file => notInTrash(file) && notOrphans(file) && notRoot(file)
    )

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
