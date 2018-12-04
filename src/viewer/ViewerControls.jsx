import React, { Component } from 'react'
import classNames from 'classnames'
import Hammer from 'hammerjs'
import PropTypes from 'prop-types'

import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react/Button'

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
    //eslint-disable-next-line react/no-find-dom-node
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
      expanded,
      controls,
      children,
      isMobileApp
    } = this.props
    const { hidden } = this.state
    const { client } = this.context

    const isPDF = currentFile.class === 'pdf'

    return (
      <div
        className={classNames(styles['pho-viewer-controls'], {
          [styles['pho-viewer-controls--expanded']]: expanded
        })}
        ref={wrapped => {
          this.wrapped = wrapped
        }}
      >
        {controls && (
          <div
            className={classNames(styles['pho-viewer-toolbar'], {
              [styles['pho-viewer-toolbar--hidden']]: hidden,
              [styles['pho-viewer-toolbar--mobilebrowser']]:
                !isMobileApp && isMobile
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
              {!isPDF &&
                !isMobile && (
                  <Button
                    theme="secondary"
                    onClick={() => {
                      client.collection('io.cozy.files').download(currentFile)
                    }}
                    icon="download"
                    label={t('Viewer.actions.download')}
                    subtle
                  />
                )}
            </div>
            {onClose && (
              <div
                className={styles['pho-viewer-toolbar-close']}
                onClick={onClose}
                title={t('Viewer.close')}
              >
                <Button
                  theme="secondary"
                  icon="cross"
                  color="white"
                  label={t('Viewer.close')}
                  iconOnly
                  extension="narrow"
                />
              </div>
            )}
          </div>
        )}
        {controls &&
          !isMobile &&
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
        {controls &&
          !isMobile &&
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
      gesturesRef: this.wrapped,
      onSwipe: this.onSwipe
    })
  }
}
ViewerControls.propTypes = {
  currentFile: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  controls: PropTypes.bool.isRequired,
  isMobileApp: PropTypes.bool.isRequired
}
export default translate()(ViewerControls)
