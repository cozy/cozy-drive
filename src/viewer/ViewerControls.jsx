import React, { Component } from 'react'
import classNames from 'classnames'
import Hammer from 'hammerjs'

import { translate } from 'cozy-ui/react/I18n'
import { downloadFile } from 'cozy-client'

import styles from './styles'

const ACTIONS_HIDE_DELAY = 3000

class ViewerControls extends Component {
  state = {
    hidden: false,
    gestures: null
  }

  showControls = () => {
    this.setState({ hidden: false })
    this.hideAfterDelay()
    document.removeEventListener('mousemove', this.showControls)
    document.addEventListener('mousemove', this.hideAfterDelay)
  }

  hideControls = () => {
    this.setState({ hidden: true })
    document.removeEventListener('mousemove', this.hideAfterDelay)
    document.addEventListener('mousemove', this.showControls)
  }

  onTap = () => {
    if (this.state.hidden) this.showControls()
    else this.hideAfterDelay()
  }

  hideAfterDelay = () => {
    clearTimeout(this.hideTimeout)
    this.hideTimeout = setTimeout(() => {
      this.hideControls()
    }, ACTIONS_HIDE_DELAY)
  }

  onSwipe = e => {
    if (e.direction === Hammer.DIRECTION_LEFT) this.props.onNext()
    else if (e.direction === Hammer.DIRECTION_RIGHT) this.props.onPrevious()
  }

  componentDidMount() {
    this.hideAfterDelay()
    const gestures = new Hammer(React.findDOMNode(this.wrapped))
    gestures.on('swipe', this.onSwipe)
    gestures.on('tap', this.onTap)
    this.setState({ gestures })
  }

  componentWillUnmount() {
    if (this.state.gestures) this.state.gestures.destroy()
  }

  render() {
    const {
      t,
      currentFile,
      onClose,
      hasPrevious,
      hasNext,
      onPrevious,
      onNext,
      isMobile,
      children
    } = this.props
    const { hidden } = this.state
    return (
      <div
        className={styles['pho-viewer-controls']}
        ref={wrapped => {
          this.wrapped = wrapped
        }}
      >
        <div
          className={classNames(styles['pho-viewer-toolbar'], {
            [styles['pho-viewer-toolbar--hidden']]: hidden
          })}
          role="viewer-toolbar"
          onMouseEnter={this.showControls}
          onMouseLeave={this.hideControls}
        >
          <div
            className={classNames(
              styles['coz-selectionbar'],
              styles['pho-viewer-toolbar-actions']
            )}
          >
            <button
              className={styles['coz-action-download']}
              onClick={() => downloadFile(currentFile)}
            >
              {t('Viewer.actions.download')}
            </button>
          </div>
          <div
            className={styles['pho-viewer-toolbar-close']}
            onClick={onClose}
            title={t('Viewer.close')}
          >
            <div className={styles['pho-viewer-toolbar-close-cross']} />
          </div>
        </div>
        {!isMobile &&
          hasPrevious && (
            <div
              role="button"
              className={classNames(
                styles['pho-viewer-nav'],
                styles['pho-viewer-nav--previous'],
                {
                  [styles['pho-viewer-nav--visible']]: !hidden
                }
              )}
              onClick={onPrevious}
              onMouseEnter={this.showControls}
              onMouseLeave={this.hideControls}
            >
              <div className={styles['pho-viewer-nav-arrow']} />
            </div>
          )}
        {this.renderChildren(children)}
        {!isMobile &&
          hasNext && (
            <div
              role="button"
              className={classNames(
                styles['pho-viewer-nav'],
                styles['pho-viewer-nav--next'],
                {
                  [styles['pho-viewer-nav--visible']]: !hidden
                }
              )}
              onClick={onNext}
              onMouseEnter={this.showControls}
              onMouseLeave={this.hideControls}
            >
              <div className={styles['pho-viewer-nav-arrow']} />
            </div>
          )}
      </div>
    )
  }

  renderChildren(children) {
    if (!children) return null
    return React.cloneElement(children[0], {
      gestures: this.state.gestures,
      gesturesRef: this.wrapped
    })
  }
}

export default translate()(ViewerControls)
