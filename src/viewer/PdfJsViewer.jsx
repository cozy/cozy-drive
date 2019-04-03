import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Document, Page } from 'react-pdf/dist/entry.webpack'
import cx from 'classnames'
import throttle from 'lodash/throttle'
import { Spinner } from 'cozy-ui/react'
import withFileUrl from './withFileUrl'
import ToolbarButton from './PdfToolbarButton'
import NoViewer from './NoViewer'
import styles from './styles'

export const MIN_SCALE = 0.25
export const MAX_SCALE = 3
export const MAX_PAGES = 3

export class PdfJsViewer extends Component {
  state = {
    totalPages: 1,
    scale: 1,
    currentPage: 1,
    loaded: false,
    errored: false,
    width: null,
    renderAllPages: false
  }

  componentDidMount() {
    this.setWrapperSize()
    this.resizeListener = throttle(this.setWrapperSize, 500)
    window.addEventListener('resize', this.resizeListener)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener)
  }

  toggleGestures(enable) {
    if (!this.props.gestures) return
    this.props.gestures.get('swipe').set({ enable })
    this.props.gestures.get('pan').set({ enable })
  }

  setWrapperSize = () => {
    const width = this.wrapper
      ? this.wrapper.getBoundingClientRect().width
      : null
    this.setState({ width })
  }

  onLoadSuccess = ({ numPages }) => {
    this.setState({
      totalPages: numPages,
      renderAllPages: numPages <= MAX_PAGES,
      loaded: true
    })
  }

  onLoadError = error => {
    // eslint-disable-next-line no-console
    console.warn(error)
    this.setState({
      errored: true
    })
  }

  nextPage = () => {
    this.setState(state => ({
      currentPage: Math.min(state.currentPage + 1, state.totalPages)
    }))
  }

  previousPage = () => {
    this.setState(state => ({
      currentPage: Math.max(state.currentPage - 1, 1)
    }))
  }

  scaleUp = () => {
    this.setState(state => {
      const previousScale = state.scale
      const scale = Math.min(previousScale + 0.25, MAX_SCALE)
      if (scale > 1 && previousScale <= 1) this.toggleGestures(false)
      return {
        scale
      }
    })
  }

  scaleDown = () => {
    this.setState(state => {
      const previousScale = state.scale
      const scale = Math.max(previousScale - 0.25, MIN_SCALE)
      if (scale <= 1 && previousScale > 1) this.toggleGestures(true)
      return {
        scale
      }
    })
  }

  render() {
    const { url } = this.props
    const {
      loaded,
      errored,
      totalPages,
      currentPage,
      scale,
      width,
      renderAllPages
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
          {renderAllPages ? (
            [...Array(totalPages)].map((_, page) => (
              <Page
                key={page}
                pageNumber={page + 1}
                width={pageWidth}
                renderAnnotations={false}
                className={cx('u-mv-1', styles['pho-viewer-pdfviewer-page'])}
              />
            ))
          ) : (
            <Page
              pageNumber={currentPage}
              width={pageWidth}
              renderAnnotations={false}
              className={styles['pho-viewer-pdfviewer-page']}
            />
          )}
        </Document>
        {loaded && (
          <div
            className={cx(styles['pho-viewer-pdfviewer-toolbar'], 'u-p-half')}
          >
            {!renderAllPages && (
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
            )}

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

PdfJsViewer.propTypes = {
  url: PropTypes.string.isRequired,
  gestures: PropTypes.object
}

export default withFileUrl(PdfJsViewer)
