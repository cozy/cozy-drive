import React from 'react'
import { Spinner } from 'cozy-ui/transpiled/react'
import FileOpenerExternal from 'drive/web/modules/viewer/FileOpenerExternal'
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
        {this.state.loading && (
          <Spinner size="xxlarge" loadingType="message" middle />
        )}
        {this.state.error && (
          <pre className="u-error">{this.state.error.toString()}</pre>
        )}
        {this.state.fileId && <FileOpenerExternal fileId={this.state.fileId} />}
        <IconSprite />
      </div>
    )
  }
}

export default Embeder
