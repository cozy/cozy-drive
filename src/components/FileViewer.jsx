import Spinner from './Spinner'
import loadingStyles from '../styles/loading'
import utilStyles from '../styles/utils'
import React from 'react'

class FileViewer extends React.Component {
  getInitialState () {
    return {
      loading: true
    }
  }

  componentDidMount() {
    const intent = this.props.intent
    cozy.client.intents.createService(intent, window)
      .then(service => {
        const { id } = service.getData()
        return cozy.client.files.getDownloadLinkById(id)
      })
      .then(link => `${cozy.client._url}${link}`)
      .then(url => {
        this.setState({ url, loading: false })
      }).catch(error => {
        this.setState({ error, loading: false })
      })
  }

  render () {
    return <div>
      { this.state.loading && <div className={ loadingStyles['fil-loading'] } /> }
      { this.state.error && <pre className='coz-error'>{ this.state.error.toString() }</pre>}
      { this.state.url && <embed className={ utilStyles.fullscreen } src={ this.state.url }/> }
    </div>
  }
}

export default FileViewer
