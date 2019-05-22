import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { translate } from 'cozy-ui/react/I18n'
import { Button, Alerter } from 'cozy-ui/transpiled/react'
import { logException } from 'drive/lib/reporter'
import { isMobileApp } from 'cozy-device-helper'

import { openLocalFileCopy } from 'drive/mobile/modules/offline/duck'

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

const DownloadButton = ({ t, file }, { client }) => (
  <Button
    onClick={() => client.collection('io.cozy.files').download(file)}
    label={t('Viewer.noviewer.download')}
  />
)

DownloadButton.contextTypes = {
  client: PropTypes.object.isRequired
}

const NoViewerButton = ({ file, t }) => {
  if (isMobileApp()) return <OpenWithCordovaButton t={t} file={file} />
  else return <DownloadButton t={t} file={file} />
}

export default translate()(NoViewerButton)
