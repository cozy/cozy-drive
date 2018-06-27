import React from 'react'
import classNames from 'classnames'
import localforage from 'localforage'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react/Button'
import Icon from 'cozy-ui/react/Icon'
import Alerter from 'cozy-ui/react/Alerter'
import { logException } from 'drive/mobile/lib/reporter'
import { isCordova } from 'drive/mobile/lib/device'
import {
  openOfflineFile,
  createTemporaryLocalFile,
  openFileWithCordova
} from 'drive/mobile/lib/filesystem'
import {
  isClientAlreadyInstalled,
  isLinux,
  NOVIEWER_DESKTOP_CTA
} from 'components/pushClient'

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
        label={t('Viewer.noviewer.openWith')}
      />
    )
  }
}

const OpenWithWebButton = ({ t, url }) => (
  <Button
    className={styles['pho-viewer-noviewer-download']}
    onClick={() => window.open(url, '_system')}
    label={t('Viewer.noviewer.openWith')}
  />
)

const DownloadButton = ({ t, file }, { client }) => (
  <Button
    className={styles['pho-viewer-noviewer-download']}
    onClick={() => client.collection('io.cozy.files').download(file)}
    label={t('Viewer.noviewer.download')}
  />
)

const NoViewerButton = ({ file, fallbackUrl, t, onError }) => {
  if (isCordova())
    return <OpenWithCordovaButton t={t} file={file} onError={onError} />
  else if (fallbackUrl) return <OpenWithWebButton t={t} url={fallbackUrl} />
  else return <DownloadButton t={t} file={file} />
}

class CallToAction extends React.Component {
  state = {
    mustShow: false
  }

  async componentWillMount() {
    const seen = (await localforage.getItem(NOVIEWER_DESKTOP_CTA)) || false
    if (!seen) {
      const mustSee = !await isClientAlreadyInstalled()
      if (mustSee) {
        this.setState(state => ({ ...state, mustShow: true }))
      }
    }
  }

  markAsSeen = element => {
    localforage.setItem(NOVIEWER_DESKTOP_CTA, true)
    this.setState(state => ({ ...state, mustShow: false }))
  }

  render() {
    if (!this.state.mustShow) return null
    const { t } = this.props
    return (
      <div className={styles['pho-viewer-noviewer-cta']}>
        <Icon
          className={styles['pho-viewer-noviewer-cta-cross']}
          color="white"
          icon="cross"
          onClick={this.markAsSeen}
        />
        <h3>{t('Viewer.noviewer.cta.saveTime')}</h3>
        <ul>
          <li>
            <a
              target="_blank"
              href={t(
                isLinux() ? 'Nav.link-client' : 'Nav.link-client-desktop'
              )}
            >
              {t('Viewer.noviewer.cta.installDesktop')}
            </a>
          </li>
          <li>{t('Viewer.noviewer.cta.accessFiles')}</li>
        </ul>
      </div>
    )
  }
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
        <CallToAction t={t} />
      </div>
    )
  }
}

export default translate()(NoViewer)
