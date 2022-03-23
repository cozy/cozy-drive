import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Alerter } from 'cozy-ui/transpiled/react'
import { logException } from 'drive/lib/reporter'
import { isMobileApp } from 'cozy-device-helper'
import { useVaultClient } from 'cozy-keys-lib'
import { useClient } from 'cozy-client'

import { openLocalFileCopy } from 'drive/mobile/modules/offline/duck'
import { downloadFile } from './helpers'
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

const OpenWithCordovaButton = connect(null, (dispatch, ownProps) => ({
  openLocalFileCopy: (client, vaultClient) =>
    dispatch(openLocalFileCopy(client, ownProps.file, { vaultClient }))
}))(({ t, openLocalFileCopy, client, vaultClient }) => (
  <AsyncActionButton
    onClick={() => openLocalFileCopy(client, vaultClient)}
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

const DownloadButton = ({ t, file }) => {
  const client = useClient()
  const vaultClient = useVaultClient()
  return (
    <Button
      onClick={() => downloadFile(client, file, { vaultClient })}
      label={t('Viewer.noviewer.download')}
    />
  )
}

DownloadButton.contextTypes = {
  client: PropTypes.object.isRequired
}

const NoViewerButton = ({ file, t }) => {
  const client = useClient()
  const vaultClient = useVaultClient()

  if (isMobileApp())
    return (
      <OpenWithCordovaButton
        t={t}
        file={file}
        client={client}
        vaultClient={vaultClient}
      />
    )
  else return <DownloadButton t={t} file={file} />
}

export default NoViewerButton
