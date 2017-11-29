import React, { Component } from 'react'
import classNames from 'classnames'
import { downloadFile } from 'cozy-client'
import { translate } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/react/Button'

import styles from './styles'

export default translate()(
  class NoViewer extends Component {
    render() {
      const { t, file } = this.props
      return (
        <div className={styles['pho-viewer-photo']}>
          <div
            className={classNames(
              styles['pho-viewer-noviewer'],
              styles[`pho-viewer-noviewer--${file.class}`]
            )}
          >
            <p className={styles['pho-viewer-noviewer-filename']}>
              {file.name}
            </p>
            <h2>{t('Viewer.noviewer.title')}</h2>
            <Button
              theme="regular"
              className={styles['pho-viewer-noviewer-download']}
              onClick={() => downloadFile(file)}
            >
              {t('Viewer.noviewer.download')}
            </Button>
          </div>
        </div>
      )
    }
  }
)
