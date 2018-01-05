import React from 'react'
import classNames from 'classnames'
import { downloadFile } from 'cozy-client'
import { logException } from '../drive/mobile/lib/reporter'
import { translate } from 'cozy-ui/react/I18n'
import Button from 'cozy-ui/react/Button'
import Alerter from 'photos/components/Alerter'
import { isCordova } from 'drive/mobile/lib/device'
import {
  openOfflineFile,
  createTemporaryLocalFile,
  openFileWithCordova
} from 'drive/mobile/lib/filesystem'

import styles from './styles'

class OpenWithCordovaButton extends React.Component {
  state = {
    loading: false
  }

  openFile = async file => {
    this.setState(state => ({ ...state, loading: true }))
    const localFile = await createTemporaryLocalFile(file.id, file.name)
    this.setState(state => ({ ...state, loading: false }))
    return openFileWithCordova(localFile.nativeURL, file.mime)
  }

  onClick = () => {
    const { file, onError } = this.props
    file.isAvailableOffline
      ? openOfflineFile(file).catch(onError)
      : this.openFile(file, onError).catch(onError)
  }

  render() {
    const { t } = this.props
    return (
      <Button
        busy={this.state.loading}
        className={styles['pho-viewer-noviewer-download']}
        onClick={this.onClick}
      >
        {t('Viewer.noviewer.openWith')}
      </Button>
    )
  }
}

const OpenWithWebButton = ({ t, url }) => (
  <Button
    className={styles['pho-viewer-noviewer-download']}
    onClick={() => window.open(url, '_system')}
  >
    {t('Viewer.noviewer.openWith')}
  </Button>
)

const DownloadButton = ({ t, file }) => (
  <Button
    className={styles['pho-viewer-noviewer-download']}
    onClick={() => downloadFile(file)}
  >
    {t('Viewer.noviewer.download')}
  </Button>
)

const NoViewerButton = ({ file, fallbackUrl, t, onError }) => {
  if (isCordova())
    return <OpenWithCordovaButton t={t} file={file} onError={onError} />
  else if (fallbackUrl) return <OpenWithWebButton t={t} url={fallbackUrl} />
  else return <DownloadButton t={t} file={file} />
}

class NoViewer extends React.Component {
  state = {
    error: null
  }
  render() {
    const { t, file, fallbackUrl = false } = this.props
    return (
      <div
        className={classNames(
          styles['pho-viewer-noviewer'],
          styles[`pho-viewer-noviewer--${file.class}`]
        )}
      >
        <p className={styles['pho-viewer-filename']}>{file.name}</p>
        <h2>{t('Viewer.noviewer.title')}</h2>
        <NoViewerButton
          file={file}
          fallbackUrl={fallbackUrl}
          t={t}
          onError={error => {
            if (/^Activity not found/.test(error.message)) {
              Alerter.error('Viewer.error.noapp', error)
            } else {
              logException(error)
              Alerter.error('Viewer.error.generic', error)
            }
          }}
        />
      </div>
    )
  }
}

export default translate()(NoViewer)
