import React from 'react'
import classNames from 'classnames'
import { downloadFile } from 'cozy-client'
import { openOfflineFile } from 'drive/mobile/lib/filesystem'
import { translate } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/react/Button'

import styles from './styles'

const NoViewer = ({ t, file }) => (
  <div
    className={classNames(
      styles['pho-viewer-noviewer'],
      styles[`pho-viewer-noviewer--${file.class}`]
    )}
  >
    <p className={styles['pho-viewer-filename']}>{file.name}</p>
    <h2>{t('Viewer.noviewer.title')}</h2>
    {file.isAvailableOffline ? (
      <Button
        theme="regular"
        className={styles['pho-viewer-noviewer-download']}
        onClick={() => openOfflineFile(file)}
      >
        {t('Viewer.noviewer.openWith')}
      </Button>
    ) : (
      <Button
        theme="regular"
        className={styles['pho-viewer-noviewer-download']}
        onClick={() => downloadFile(file)}
      >
        {t('Viewer.noviewer.download')}
      </Button>
    )}
  </div>
)

export default translate()(NoViewer)
