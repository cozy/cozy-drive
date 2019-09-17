import React, { Component } from 'react'
import { Icon, translate } from 'cozy-ui/transpiled/react'

import Scanner from './Scanner'
import toolbarContainer from '../toolbar'
import PortaledQueue from './PortaledQueue'

import {
  startMediaBackup,
  cancelMediaBackup
} from 'drive/mobile/modules/mediaBackup/duck'

import { connect } from 'react-redux'
/**
 *
 */

const ScanItemMenu = translate()(({ status, onClick, t, online }) => {
  const offlineMessage = () => {
    return alert(t('Scan.error.offline'))
  }
  const uploadingMessage = () => {
    return alert(t('Scan.error.uploading'))
  }
  const actionOnClick = (() => {
    if (status === 'uploading') return uploadingMessage
    if (!online) return offlineMessage
    return onClick
  })()

  return (
    <span className="u-pl-1 u-flex u-pt-half u-pb-half" onClick={actionOnClick}>
      <Icon icon="camera" />
      <span className="u-pl-half">{t('scann a doc')}</span>
    </span>
  )
})
class ScanItem extends Component {
  render() {
    const { displayedFolder, stopMediaBackup, startMediaBackup } = this.props
    return (
      <>
        <Scanner
          dirId={displayedFolder.id} //Pour savoir où uploader
          pluginConfig={{
            sourceType: 1 // Camera
          }}
          generateName={() => {
            const date = new Date()
            return `Scan_${date.toISOString()}.jpg`
          }}
          onConflict={'rename'}
          onBeforeUpload={() => stopMediaBackup()}
          onFinish={() => startMediaBackup()}
        >
          {({ status, error, onClick, filename, onClear, online }) => {
            if (error) {
              return (
                <ScanItemMenu
                  status={status}
                  onClick={onClick}
                  online={online}
                />
              )
            }
            if (!filename)
              return (
                <ScanItemMenu
                  status={status}
                  onClick={onClick}
                  online={online}
                />
              )
            return (
              <>
                <ScanItemMenu
                  status={status}
                  onClick={onClick}
                  online={online}
                />
                <PortaledQueue
                  file={{
                    file: {
                      name: filename,
                      isDirectory: false,
                      status
                    }
                  }}
                  successCount={status === 'done' ? 1 : 0}
                  doneCount={1}
                  key={filename}
                  onClear={onClear}
                />
              </>
            )
          }}
        </Scanner>
      </>
    )
  }
}
const mapDispatchToProps = dispatch => ({
  stopMediaBackup: () => dispatch(cancelMediaBackup()),
  startMediaBackup: () => dispatch(startMediaBackup())
})
export default connect(
  null,
  mapDispatchToProps
)(toolbarContainer(ScanItem))
