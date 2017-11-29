import React, { Component } from 'react'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'
import { downloadFile } from 'cozy-client'

import styles from './styles'

const ACTIONS_HIDE_DELAY = 3000

class ViewerControls extends Component {
  state = {
    hidden: false
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

  onPreviousClick = () => {
    if (this.state.hidden) this.showControls()
    else this.hideAfterDelay()
    this.props.onPrevious()
  }

  onNextClick = () => {
    if (this.state.hidden) this.showControls()
    else this.hideAfterDelay()
    this.props.onNext()
  }

  hideAfterDelay = () => {
    clearTimeout(this.hideTimeout)
    this.hideTimeout = setTimeout(() => {
      this.hideControls()
    }, ACTIONS_HIDE_DELAY)
  }

  componentDidMount() {
    this.hideAfterDelay()
  }

  render() {
    const {
      t,
      currentFile,
      onClose,
      hasPrevious,
      hasNext,
      children
    } = this.props
    const { hidden } = this.state
    return (
      <div className={styles['pho-viewer-controls']}>
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
        {hasPrevious && (
          <div
            role="button"
            className={classNames(
              styles['pho-viewer-nav'],
              styles['pho-viewer-nav--previous'],
              {
                [styles['pho-viewer-nav--visible']]: !hidden
              }
            )}
            onClick={this.onPreviousClick}
            onMouseEnter={this.showControls}
            onMouseLeave={this.hideControls}
          >
            <div className={styles['pho-viewer-nav-arrow']} />
          </div>
        )}
        {children}
        {hasNext && (
          <div
            role="button"
            className={classNames(
              styles['pho-viewer-nav'],
              styles['pho-viewer-nav--next'],
              {
                [styles['pho-viewer-nav--visible']]: !hidden
              }
            )}
            onClick={this.onNextClick}
            onMouseEnter={this.showControls}
            onMouseLeave={this.hideControls}
          >
            <div className={styles['pho-viewer-nav-arrow']} />
          </div>
        )}
      </div>
    )
  }
}

export default translate()(ViewerControls)
