import React from 'react'
import { Spinner, IntentHeader } from 'cozy-ui/react'
import FileOpener from 'drive/web/modules/drive/FileOpenerExternal'
import { IconSprite } from 'cozy-ui/transpiled/react/'

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
      this.setState({ fileId: id, loading: false })
    } catch (error) {
      this.setState({ error, loading: false })
    }
  }

  render() {
    return (
      <div>
        <IntentHeader appName="Drive" appEditor="Cozy" />
        {this.state.loading && (
          <Spinner size="xxlarge" loadingType="message" middle />
        )}
        {this.state.error && (
          <pre className="u-error">{this.state.error.toString()}</pre>
        )}
        {this.state.fileId && (
          <FileOpener fileId={this.state.fileId} withCloseButtton={false} />
        )}
        <IconSprite />
      </div>
    )
  }
}

export default Embeder
