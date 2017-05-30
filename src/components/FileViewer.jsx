/* global cozy */

import utilStyles from '../styles/utils'
import React from 'react'
import Loading from './Loading'

class FileViewer extends React.Component {
  getInitialState () {
    return {
      loading: true
    }
  }

  componentDidMount () {
    this.startService()
  }

  async startService () {
    const { intentId } = this.props

    try {
      const service = await cozy.client.intents.createService(intentId, window)
      const { id } = service.getData()
      const intent = this.intent = service.getIntent()
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

      if (service && intent.attributes.action === 'GET_URL') {
        service.terminate({ error })
      }
    }
  }

  render () {
    return <div>
      { this.state.loading && <Loading /> }
      { this.state.error && <pre className='coz-error'>{ this.state.error.toString() }</pre>}
      { this.state.url && <embed className={utilStyles.fullscreen} src={this.state.url} /> }
    </div>
  }
}

export default FileViewer
