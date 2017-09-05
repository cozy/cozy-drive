/* global cozy */

import utilStyles from '../styles/utils'
import React from 'react'
import Spinner from 'cozy-ui/react/Spinner'

import FuzzyPathSearch from '../lib/fuzzyPathSearch'

class IntentHandler extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    this.startService()
  }

  async startService () {
    const { intentId } = this.props

    let service
    let intent
    try {
      service = await cozy.client.intents.createService(intentId, window)
      intent = this.intent = service.getIntent()
      if (intent.attributes.type === 'io.cozy.suggestions') {
        this.setupSuggestionSource(service, intent)
        return
      }
      const { id } = service.getData()
      const link = await cozy.client.files.getDownloadLinkById(id)
      const url = `${cozy.client._url}${link}`
      switch (intent.attributes.action) {
        case 'OPEN':
          this.setState({ url, loading: false })
          break
        case 'GET_URL':
          service.terminate({ url })
          break
      }
    } catch (error) {
      this.setState({ error, loading: false })
      if (service && intent && intent.attributes.action === 'GET_URL') {
        service.terminate({ error: error.message })
      }
    }
  }

  async setupSuggestionSource (service, intent) {
    const index = await cozy.client.data.defineIndex('io.cozy.files', ['_id'])
    const files = await cozy.client.data.query(index, {
      selector: {
        _id: {'$gt': null}
      }
    })

    const folders = files.filter(file => file.type === 'directory')

    const normalizedFiles = files.filter(file => file.trashed === false).map(file => {
      const dir = file.type === 'directory' ? file : folders.find(folder => folder._id === file.dir_id)

      return {
        id: file._id,
        name: file.name,
        path: dir.path || '',
        url: window.location.origin + '/#/files/' + dir._id
      }
    })

    const fuzzyPathSearch = new FuzzyPathSearch(normalizedFiles)

    const messageEventListener = async (event) => {
      if (event.origin !== intent.attributes.client) return

      const { query } = event.data
      const searchResults = fuzzyPathSearch.search(query)

      window.parent.postMessage({
        type: `intent-${intent._id}:data`,
        suggestions: searchResults.map(result => ({
          id: result.id,
          title: result.name,
          subtitle: result.path,
          term: result.name,
          onSelect: 'open:' + result.url
        }))
      }, intent.attributes.client)
    }

    window.addEventListener('message', messageEventListener)
  }

  render () {
    return <div>
      { this.state.loading &&
        <Spinner
          size='xxlarge'
          loadingType='message'
          middle='true'
        /> }
      { this.state.error && <pre className='coz-error'>{ this.state.error.toString() }</pre>}
      { this.state.url && <embed className={utilStyles.fullscreen} src={this.state.url} /> }
    </div>
  }
}

export default IntentHandler
