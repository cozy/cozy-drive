import React from 'react'
import FuzzyPathSearch from '../FuzzyPathSearch'
import { getFileTypeFromMime } from 'drive/lib/getFileTypeFromMime'

const TYPE_DIRECTORY = 'directory'

class SuggestionProvider extends React.Component {
  componentDidMount() {
    const { intent } = this.props
    this.hasIndexedFiles = false

    // re-attach the message listener for the intent to receive the suggestion requests
    window.addEventListener('message', event => {
      if (event.origin !== intent.attributes.client) return null
      const { query, id } = event.data
      this.provideSuggestions(query, id, intent)
    })

    this.context.client.startReplicationFrom(() => {}) // the sync functions take a redux-style `dispatch` function as a callback, but we don't handle the replication status at the moment
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
    return new Promise(async resolve => {
      const allDocs = await this.context.client.fetchDocuments(
        'files',
        'io.cozy.files'
      )

      const files = allDocs.data
      const folders = files.filter(file => file.type === TYPE_DIRECTORY)

      const notInTrash = file =>
        !file.trashed && !/^\/\.cozy_trash/.test(file.path)
      const notOrphans = file =>
        folders.find(folder => folder._id === file.dir_id) !== undefined

      const normalizedFiles = files
        .filter(notInTrash)
        .filter(notOrphans)
        .map(file => {
          const isDir = file.type === TYPE_DIRECTORY
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
            url: window.location.origin + '/#/folder/' + dirId,
            icon: getIconUrl(file)
          }
        })

      this.fuzzyPathSearch = new FuzzyPathSearch(normalizedFiles)
      this.hasIndexedFiles = true
      resolve()
    })
  }
}

const iconsContext = require.context(
  '../../../assets/icons/',
  false,
  /icon-type-.*.svg$/
)
const icons = iconsContext.keys().reduce((acc, item) => {
  acc[item.replace(/\.\/icon-type-(.*)\.svg/, '$1')] = iconsContext(item)
  return acc
}, {})

function getIconUrl(file) {
  const keyIcon =
    file.type === TYPE_DIRECTORY
      ? 'folder'
      : getFileTypeFromMime(icons)(file.mime) ||
        console.warn(
          `No icon found, you may need to add a mapping for ${file.mime}`
        ) ||
        'files'

  return `${window.location.origin}/${icons[keyIcon]}`
}

export default SuggestionProvider
