import React from 'react'
import classNames from 'classnames'
import { downloadFile } from 'cozy-client'
import { isCordova } from 'drive/mobile/lib/device'
import { openOfflineFile, openOnlineFile } from 'drive/mobile/lib/filesystem'
import { translate } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/react/Button'

import styles from './styles'

const OpenWithCordova = ({ t, file }) => (
  <Button
    theme="regular"
    className={styles['pho-viewer-noviewer-download']}
    onClick={() =>
      file.isAvailableOffline ? openOfflineFile(file) : openOnlineFile(file)
    }
  >
    {t('Viewer.noviewer.openWith')}
  </Button>
)

const OpenWithWeb = ({ t, url }) => (
  <Button
    theme="regular"
    className={styles['pho-viewer-noviewer-download']}
    onClick={() => window.open(url, '_system')}
  >
    {t('Viewer.noviewer.openWith')}
  </Button>
)

const Download = ({ t, file }) => (
  <Button
    theme="regular"
    className={styles['pho-viewer-noviewer-download']}
    onClick={() => downloadFile(file)}
  >
    {t('Viewer.noviewer.download')}
  </Button>
)

const NoViewer = ({ t, file, fallbackUrl = false }) => {
  let action
  if (isCordova()) action = <OpenWithCordova t={t} file={file} />
  else if (fallbackUrl) action = <OpenWithWeb t={t} url={fallbackUrl} />
  else action = <Download t={t} file={file} />

  return (
    <div
      className={classNames(
        styles['pho-viewer-noviewer'],
        styles[`pho-viewer-noviewer--${file.class}`]
      )}
    >
      <p className={styles['pho-viewer-filename']}>{file.name}</p>
      <h2>{t('Viewer.noviewer.title')}</h2>
      {action}
    </div>
  )
}

export default translate()(NoViewer)
