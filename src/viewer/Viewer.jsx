import React, { Component } from 'react'

import ViewerControls from './ViewerControls'
import ImageViewer from './ImageViewer'
import AudioViewer from './AudioViewer'
import VideoViewer from './VideoViewer'
import PdfViewer from './PdfViewer'
import NoViewer from './NoViewer'

import styles from './styles'

const KEY_CODE_LEFT = 37
const KEY_CODE_RIGHT = 39

const isAndroid = () =>
  window.navigator.userAgent &&
  window.navigator.userAgent.indexOf('Android') >= 0
const isIOS = () =>
  window.navigator.userAgent &&
  /iPad|iPhone|iPod/.test(window.navigator.userAgent)
const isMobile = () => isAndroid() || isIOS()
const isCordova = () => window.cordova !== undefined

export default class Viewer extends Component {
  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp, false)
  }

  onKeyUp = e => {
    if (e.keyCode === KEY_CODE_LEFT) this.onPrevious()
    else if (e.keyCode === KEY_CODE_RIGHT) this.onNext()
  }

  onNext = () => {
    const { files, currentIndex } = this.props
    if (currentIndex === files.length - 1) {
      return
    }
    const nextIndex = currentIndex + 1
    const nextFile = files[nextIndex]
    this.onChange(nextFile, nextIndex)
  }

  onPrevious = () => {
    const { files, currentIndex } = this.props
    if (currentIndex === 0) {
      return
    }
    const prevIndex = currentIndex - 1
    const prevFile = files[prevIndex]
    this.onChange(prevFile, prevIndex)
  }

  onChange(nextFile, nextIndex) {
    if (this.props.onChange) {
      this.props.onChange(nextFile, nextIndex)
    }
  }

  render() {
    const { files, currentIndex, onClose } = this.props
    const currentFile = files[currentIndex]
    const fileCount = files.length
    const hasPrevious = currentIndex > 0
    const hasNext = currentIndex < fileCount - 1
    // this `expanded` property makes the next/previous controls cover the displayed image
    const expanded = currentFile && currentFile.class === 'image'
    return (
      <div className={styles['pho-viewer-wrapper']} role="viewer">
        <ViewerControls
          currentFile={currentFile}
          onClose={onClose}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onPrevious={this.onPrevious}
          onNext={this.onNext}
          isMobile={isMobile()}
          expanded={expanded}
        >
          {this.renderViewer(currentFile)}
        </ViewerControls>
      </div>
    )
  }

  renderViewer(file) {
    if (!file) return null
    const ComponentName = this.getViewerComponentName(file)
    return <ComponentName file={file} />
  }

  getViewerComponentName(file) {
    switch (file.class) {
      case 'image':
        return ImageViewer
      case 'audio':
        return AudioViewer
      case 'video':
        return isMobile() ? NoViewer : VideoViewer
      case 'pdf':
        return isCordova() ? NoViewer : PdfViewer
      default:
        return NoViewer
    }
  }
}
