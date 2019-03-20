import React, { Component } from 'react'
import { Document, Page } from 'react-pdf/dist/entry.webpack'
import cx from 'classnames'
import throttle from 'lodash/throttle'
import { Button, Spinner } from 'cozy-ui/react'
import withFileUrl from './withFileUrl'
import NoViewer from './NoViewer'
import styles from './styles'

export const MIN_SCALE = 0.25
export const MAX_SCALE = 3

const ToolbarButton = ({ icon, onClick, disabled }) => (
  <Button
    iconOnly
    subtle
    theme="secondary"
    className="u-p-half u-m-half"
    icon={icon}
    onClick={onClick}
    disabled={disabled}
  />
)

export class PdfJsViewer extends Component {
  state = {
    totalPages: 1,
    scale: 1,
    currentPage: 1,
    loaded: false,
    errored: false,
    width: null
  }

  constructor(props) {
    super(props)

    this.wrapper = null
    this.resizeListener = null

    this.onLoadSuccess = this.onLoadSuccess.bind(this)
    this.onLoadError = this.onLoadError.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.scaleUp = this.scaleUp.bind(this)
    this.scaleDown = this.scaleDown.bind(this)
    this.setWrapperSize = this.setWrapperSize.bind(this)
  }

  componentDidMount() {
    this.setWrapperSize()
    this.resizeListener = throttle(this.setWrapperSize, 500)
    window.addEventListener('resize', this.resizeListener)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener)
  }

  setWrapperSize = () => {
    this.setState({ width: this.wrapper.getBoundingClientRect().width })
  }

  async onLoadSuccess({ numPages }) {
    this.setState({
      totalPages: numPages,
      loaded: true
    })
  }

  async onLoadError(error) {
    console.warn(error)
    this.setState({
      errored: true
    })
  }

  nextPage() {
    this.setState(state => ({
      currentPage: Math.min(state.currentPage + 1, state.totalPages)
    }))
  }

  previousPage() {
    this.setState(state => ({
      currentPage: Math.max(state.currentPage - 1, 1)
    }))
  }

  scaleUp() {
    this.setState(state => ({
      scale: Math.min(state.scale + 0.25, MAX_SCALE)
    }))
  }

  scaleDown() {
    this.setState(state => ({
      scale: Math.max(state.scale - 0.25, MIN_SCALE)
    }))
  }

  render() {
    const { url } = this.props
    const {
      loaded,
      errored,
      totalPages,
      currentPage,
      scale,
      width
    } = this.state

    if (errored) return <NoViewer file={url} />
    const pageWidth = width ? width * scale : null // newer versions of react-pdf do that automatically

    return (
      <div
        data-test-id="viewer-pdf"
        className={styles['pho-viewer-pdfviewer']}
        ref={ref => (this.wrapper = ref)}
      >
        <Document
          file={url}
          onLoadSuccess={this.onLoadSuccess}
          onLoadError={this.onLoadError}
          className={styles['pho-viewer-pdfviewer-pdf']}
          loading={<Spinner size="xxlarge" middle noMargin color="white" />}
        >
          <Page pageNumber={currentPage} width={pageWidth} />
        </Document>
        {loaded && (
          <div
            className={cx(styles['pho-viewer-pdfviewer-toolbar'], 'u-p-half')}
          >
            <span className="u-mh-half">
              <ToolbarButton
                icon="top"
                onClick={this.previousPage}
                disabled={currentPage === 1}
              />
              {currentPage}/{totalPages}
              <ToolbarButton
                icon="bottom"
                onClick={this.nextPage}
                disabled={currentPage === totalPages}
              />
            </span>
            <span className="u-mh-half">
              <ToolbarButton
                icon="dash"
                onClick={this.scaleDown}
                disabled={scale === MIN_SCALE}
              />
              <ToolbarButton
                icon="plus"
                onClick={this.scaleUp}
                disabled={scale === MAX_SCALE}
              />
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default withFileUrl(PdfJsViewer)
