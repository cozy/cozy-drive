import React, { Component } from 'react'
import classNames from 'classnames'

import { translate } from 'cozy-ui/react/I18n'
import { downloadFile } from 'cozy-client'

import styles from './viewerToolbar'

const ACTIONS_HIDE_DELAY = 3000

class ViewerToolbar extends Component {
  componentDidMount() {
    this.hideActionsAfterDelay()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.hidden && !this.props.hidden) this.hideActionsAfterDelay()
  }

  hideActionsAfterDelay() {
    clearTimeout(this.hideActionsTimeout)
    this.hideActionsTimeout = setTimeout(() => {
      this.props.onHide()
    }, ACTIONS_HIDE_DELAY)
  }

  render() {
    const { t, hidden, currentFile, onClose } = this.props
    return (
      <div
        className={classNames(styles['pho-viewer-toolbar'], {
          [styles['pho-viewer-toolbar--hidden']]: hidden
        })}
        role="viewer-toolbar"
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
    )
  }
}

export default translate()(ViewerToolbar)
