import React, { Component } from 'react'
import classNames from 'classnames'

import ViewerToolbar from './ViewerToolbar'
import ImageViewer from './ImageViewer'
import AudioViewer from './AudioViewer'
import VideoViewer from './VideoViewer'
import NoViewer from './NoViewer'

import styles from './viewer'

const KEY_CODE_LEFT = 37
const KEY_CODE_RIGHT = 39

const isAndroid = () =>
  window.navigator.userAgent &&
  window.navigator.userAgent.indexOf('Android') >= 0
const isIOS = () =>
  window.navigator.userAgent &&
  /iPad|iPhone|iPod/.test(window.navigator.userAgent)
const isMobile = () => isAndroid() || isIOS()

export default class Viewer extends Component {
  state = {
    controlsHidden: false
  }

  showControls = () => {
    this.setState({ controlsHidden: false })
    document.removeEventListener('mousemove', this.showControls)
  }
  hideControls = () => {
    this.setState({ controlsHidden: true })
    document.addEventListener('mousemove', this.showControls)
  }

  componentDidMount() {
    document.addEventListener('keyup', this.onKeyUp, false)
    document.addEventListener('mousemove', this.showControls)
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.onKeyUp, false)
    document.removeEventListener('mousemove', this.showControls)
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

    const { controlsHidden } = this.state
    return (
      <div className={styles['pho-viewer-wrapper']} role="viewer">
        <ViewerToolbar
          hidden={controlsHidden}
          onHide={this.hideControls}
          currentFile={currentFile}
          onClose={onClose}
        />
        {hasPrevious && (
          <a
            role="button"
            className={classNames(styles['pho-viewer-nav-previous'], {
              [styles['pho-viewer-nav-previous--hidden']]: controlsHidden
            })}
            onClick={this.onPrevious}
          />
        )}
        {this.renderViewer(currentFile)}
        {hasNext && (
          <a
            role="button"
            className={classNames(styles['pho-viewer-nav-next'], {
              [styles['pho-viewer-nav-next--hidden']]: controlsHidden
            })}
            onClick={this.onNext}
          />
        )}
      </div>
    )
  }

  renderViewer(file) {
    if (!file) return null
    const ComponentName = this.getViewerComponentName(file)
    return (
      <ComponentName
        file={file}
        onSwipeLeft={this.onNext}
        onSwipeRight={this.onPrevious}
        onTap={this.showControls}
      />
    )
  }

  getViewerComponentName(file) {
    switch (file.class) {
      case 'image':
        return ImageViewer
      case 'audio':
        return AudioViewer
      case 'video':
        return isMobile() ? NoViewer : VideoViewer
      default:
        return NoViewer
    }
  }
}
