import React from 'react'
import { Router, Route, hashHistory } from 'react-router'

import Spinner from 'cozy-ui/transpiled/react/Spinner'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import withBreakpoints from 'cozy-ui/transpiled/react/helpers/withBreakpoints'

import FileOpenerExternal from 'drive/web/modules/viewer/FileOpenerExternal'
import { isOfficeEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'
import OnlyOfficeView from 'drive/web/modules/views/OnlyOffice'

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
    const {
      service,
      breakpoints: { isDesktop }
    } = this.props
    return (
      <div>
        {this.state.loading && (
          <Spinner size="xxlarge" middle noMargin color="white" />
        )}
        {this.state.error && (
          <pre className="u-error">{this.state.error.toString()}</pre>
        )}
        {this.state.fileId && (
          <Router history={hashHistory}>
            <Route
              path="/"
              component={() => (
                <FileOpenerExternal
                  service={service}
                  fileId={this.state.fileId}
                />
              )}
            />
            {isOfficeEnabled(isDesktop) && (
              <Route path="onlyoffice/:fileId" component={OnlyOfficeView} />
            )}
          </Router>
        )}
        <Sprite />
      </div>
    )
  }
}

export default withBreakpoints()(Embeder)
