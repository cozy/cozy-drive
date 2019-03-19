import React, { Component } from 'react'
import { Document, Page } from 'react-pdf'
import withFileUrl from './withFileUrl'
import Spinner from 'cozy-ui/react/Spinner'
import styles from './styles'
import cx from 'classnames'
import { Button } from 'cozy-ui/react'

class PdfJsViewer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalPages: 1,
      scale: 1,
      currentPage: 1,
      loaded: false,
    }
    this.onLoadSuccess = this.onLoadSuccess.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.scaleUp = this.scaleUp.bind(this)
    this.scaleDown = this.scaleDown.bind(this)
  }

  async onLoadSuccess ({ numPages }) {
    this.setState({
      totalPages: numPages,
      loaded: true
    })
  }

  nextPage () {
    this.setState(state => ({
      currentPage: Math.min(state.currentPage + 1, state.totalPages)
    }))
  }

  previousPage () {
    this.setState(state => ({
      currentPage: Math.max(state.currentPage - 1, 1)
    }))
  }

  scaleUp () {
    this.setState(state => ({
      scale: Math.min(state.scale + .25, 3)
    }))
  }

  scaleDown () {
    this.setState(state => ({
      scale: Math.max(state.scale - .25, .25)
    }))
  }

  render() {
    const { url } = this.props
    const { loaded, totalPages, currentPage, scale } = this.state

    return (
      <div
        data-test-id="viewer-pdf"
        className={styles['pho-viewer-pdfviewer']}
      >
        <Document
          file={url}
          onLoadSuccess={this.onLoadSuccess}
          className={styles['pho-viewer-pdfviewer-pdf']}
          loading={<Spinner size="xxlarge" middle noMargin color="white" />}
          error={"error"}
        >
          <Page pageNumber={currentPage} scale={scale} />
        </Document>
        { loaded &&
          <div className={cx(styles['pho-viewer-pdfviewer-toolbar'], 'u-p-half')}>
            <span className="u-mh-1">
              <Button iconOnly subtle theme="secondary" className="u-p-half u-m-half" icon="top" onClick={this.previousPage} />
              {currentPage}/{totalPages}
              <Button iconOnly subtle theme="secondary" className="u-p-half u-m-half" icon="bottom" onClick={this.nextPage} />
            </span>
            <span className="u-mh-half">
              <Button iconOnly subtle theme="secondary" className="u-p-half u-m-half" icon="dash" onClick={this.scaleDown} />
              <Button iconOnly subtle theme="secondary" className="u-p-half u-m-half" icon="plus" onClick={this.scaleUp} />
            </span>
          </div>
        }
      </div>
    )
  }
}

export default withFileUrl(PdfJsViewer)
