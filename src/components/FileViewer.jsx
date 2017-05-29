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
    const { intentId } = this.props

    let service, intent
    cozy.client.intents.createService(intentId, window)
      .then(_service => {
        service = _service
        const { id } = service.getData()
        intent = this.intent = service.getIntent()
        return cozy.client.files.getDownloadLinkById(id)
      })
      .then(link => `${cozy.client._url}${link}`)
      .then(url => {
        switch (intent.attributes.action) {
          case 'OPEN':
            this.setState({ url, loading: false })
            break
          case 'GET_URL':
            service.terminate({ url })
            break
        }
      }).catch(error => {
        this.setState({ error, loading: false })

        if (this.intent.attributes.action === 'GET_URL') {
          service.terminate({ error })
        }
      })
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
