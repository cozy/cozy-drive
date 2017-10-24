/* global cozy */
import React from 'react'
import FuzzyPathSearch from '../FuzzyPathSearch'

class SuggestionProvider extends React.Component {
  componentDidMount() {
    const { intent } = this.props
    this.hasIndexedFiles = false

    // re-attach the message listener for the intent to receive the suggestion requests
    window.addEventListener('message', event => {
      if (event.origin !== intent.attributes.client) return null
      const { query } = event.data
      this.provideSuggestions(query, intent)
    })
  }

  async provideSuggestions(query, intent) {
    if (!this.hasIndexedFiles) {
      await this.indexFiles()
    }

    const searchResults = this.fuzzyPathSearch.search(query)

    window.parent.postMessage(
      {
        type: `intent-${intent._id}:data`,
        suggestions: searchResults.map(result => ({
          id: result.id,
          title: result.name,
          subtitle: result.path,
          term: result.name,
          onSelect: 'open:' + result.url
        }))
      },
      intent.attributes.client
    )
  }

  // fetches pretty much all the files and preloads FuzzyPathSearch
  async indexFiles() {
    return new Promise(async resolve => {
      const index = await cozy.client.data.defineIndex('io.cozy.files', ['_id'])

      let files = []
      const limit = 100
      const pageLimit = 500 // that's 50 000 files max
      let page = 0
      let response
      do {
        response = await cozy.client.data.query(index, {
          selector: { _id: { $gt: null } },
          limit: limit,
          skip: page * limit,
          wholeResponse: true
        })
        files = files.concat(response.docs)
        ++page
      } while (response.next && page < pageLimit)

      const folders = files.filter(file => file.type === 'directory')

      const normalizedFiles = files
        .filter(file => file.trashed === false)
        .map(file => {
          const isDir = file.type === 'directory'
          const dirId = isDir ? file._id : file.dir_id
          let path
          if (isDir) {
            path = file.path
          } else {
            const parentDir = folders.find(folder => folder._id === file.dir_id)
            path = parentDir && parentDir.path ? parentDir.path : ''
          }

          return {
            id: file._id,
            name: file.name,
            path,
            url: window.location.origin + '/#/folder/' + dirId
          }
        })

      this.fuzzyPathSearch = new FuzzyPathSearch(normalizedFiles)
      this.hasIndexedFiles = true
      resolve()
    })
  }
}

export default SuggestionProvider
