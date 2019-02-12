import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import { Button } from 'cozy-ui/react/Button'
import Alerter from 'cozy-ui/react/Alerter'
import { logException } from 'drive/lib/reporter'
import { isMobileApp } from 'cozy-device-helper'
import CallToAction from './CallToAction'

import { openLocalFileCopy } from 'drive/mobile/modules/offline/duck'

import styles from './styles'

class AsyncActionButton extends React.Component {
  state = {
    loading: false
  }

  onClick = async () => {
    const { onClick, onError } = this.props
    this.setState(state => ({ ...state, loading: true }))
    try {
      await onClick()
    } catch (error) {
      onError(error)
    }
    this.setState(state => ({ ...state, loading: false }))
  }

  render() {
    const { label, className } = this.props
    return (
      <Button
        busy={this.state.loading}
        className={className}
        onClick={this.onClick}
        label={label}
      />
    )
  }
}

const OpenWithCordovaButton = connect(
  null,
  (dispatch, ownProps) => ({
    openLocalFileCopy: () => dispatch(openLocalFileCopy(ownProps.file))
  })
)(({ t, openLocalFileCopy, onError }) => (
  <AsyncActionButton
    className={styles['pho-viewer-noviewer-download']}
    onClick={openLocalFileCopy}
    onError={onError}
    label={t('Viewer.noviewer.openWith')}
  />
))

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
  if (isMobileApp())
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
