/* global cozy */
import React from 'react'
import FuzzyPathSearch from '../FuzzyPathSearch'
import { withClient } from 'cozy-client'

import { TYPE_DIRECTORY, makeNormalizedFile } from './helpers'
import { getIconUrl } from './iconContext'

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

  async provideSuggestions(query, id, intent) {
    if (!this.hasIndexedFiles) {
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
          onSelect: 'open:' + result.url,
          icon: result.icon
        }))
      },
      intent.attributes.client
    )
  }

  // fetches pretty much all the files and preloads FuzzyPathSearch
  async indexFiles() {
    const { client } = this.props
    // TODO: fix me
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      const resp = await cozy.client.fetchJSON(
        'GET',
        `/data/io.cozy.files/_all_docs?include_docs=true`
      )
      const files = resp.rows
        // TODO: fix me
        // eslint-disable-next-line no-prototype-builtins
        .filter(row => !row.doc.hasOwnProperty('views'))
        .map(row => ({ id: row.id, ...row.doc }))

      const folders = files.filter(file => file.type === TYPE_DIRECTORY)

      const notInTrash = file =>
        !file.trashed && !/^\/\.cozy_trash/.test(file.path)
      const notOrphans = file =>
        folders.find(folder => folder._id === file.dir_id) !== undefined

      const normalizedFilesPrevious = files
        .filter(notInTrash)
        .filter(notOrphans)

      const normalizedFiles = await Promise.all(
        normalizedFilesPrevious.map(
          async file =>
            await makeNormalizedFile(client, folders, file, getIconUrl)
        )
      )

      this.fuzzyPathSearch = new FuzzyPathSearch(normalizedFiles)
      this.hasIndexedFiles = true
      resolve()
    })
  }

  render() {
    return null
  }
}

export default withClient(SuggestionProvider)
