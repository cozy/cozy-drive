import React from 'react'
import styles from '../services.styl'
import Spinner from 'cozy-ui/react/Spinner'
import { getFileDownloadUrl } from '../../../actions'

class Embeder extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    this.fetchFileUrl()
  }

  async fetchFileUrl () {
    const { service } = this.props

    try {
      const { id } = service.getData()
      const url = await getFileDownloadUrl(id)
      this.setState({ url, loading: false })
    } catch (error) {
      this.setState({ error, loading: false })
    }
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
      { this.state.url && <embed className={styles.fullscreen} src={this.state.url} /> }
    </div>
  }
}

export default Embeder
