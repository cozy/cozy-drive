import React from 'react'
import { connect } from 'react-redux'
import { useVaultClient } from 'cozy-keys-lib'
import { useClient } from 'cozy-client'

import { Button, Alerter } from 'cozy-ui/transpiled/react'
import { logException } from 'drive/lib/reporter'
import { isMobileApp } from 'cozy-device-helper'
import { openLocalFileCopy } from 'drive/mobile/modules/offline/duck'

import { downloadFile } from './helpers'
import { getFolderEncryptionKey } from 'drive/web/modules/selectors'

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
)(({ t, openLocalFileCopy }) => (
  <AsyncActionButton
    onClick={openLocalFileCopy}
    onError={error => {
      if (/^Activity not found/.test(error.message)) {
        Alerter.error('Viewer.error.noapp', error)
      } else {
        logException(error)
        Alerter.error('Viewer.error.generic', error)
      }
    }}
    label={t('Viewer.noviewer.openWith')}
  />
))

const DownloadButton = ({ t, file, encryptionKey }) => {
  console.log('download button in no viewer')
  const client = useClient()
  const vaultClient = useVaultClient()
  return (
    <Button
      onClick={() => downloadFile(client, file, { vaultClient, encryptionKey })}
      label={t('Viewer.noviewer.download')}
    />
  )
}

const NoViewerButton = ({ file, t, encryptionKey }) => {
  if (isMobileApp()) return <OpenWithCordovaButton t={t} file={file} />
  else return <DownloadButton t={t} file={file} encryptionKey={encryptionKey} />
}

const mapStateToProps = state => ({
  encryptionKey: getFolderEncryptionKey(state)
})

export default connect(mapStateToProps)(NoViewerButton)
