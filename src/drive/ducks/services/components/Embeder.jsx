/* global cozy */
import React from 'react'
import util from 'cozy-ui/stylus/utilities/text'
import Spinner from 'cozy-ui/react/Spinner'
import Viewer from 'viewer'

class Embeder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true
    }
  }

  componentDidMount() {
    this.fetchFileUrl()
  }

  async fetchFileUrl() {
    const { service } = this.props

    try {
      const { id } = service.getData()
      const stats = await cozy.client.files.statById(id, false)
      this.setState({ file: { ...stats.attributes, id }, loading: false })
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  render() {
    return (
      <div>
        {this.state.loading && (
          <Spinner size="xxlarge" loadingType="message" middle="true" />
        )}
        {this.state.error && (
          <pre className={util['u-error']}>{this.state.error.toString()}</pre>
        )}
        {this.state.file && (
          <Viewer files={[this.state.file]} currentIndex={0} />
        )}
      </div>
    )
  }
}

export default Embeder
