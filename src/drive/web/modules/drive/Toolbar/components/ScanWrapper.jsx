import React, { Component } from 'react'
import { Icon, translate } from 'cozy-ui/transpiled/react'

import Scanner from './Scanner'
import { SCANNER_DONE, SCANNER_UPLOADING } from './Scanner'
import toolbarContainer from '../toolbar'
import PortaledQueue from './PortaledQueue'

import {
  startMediaBackup,
  cancelMediaBackup
} from 'drive/mobile/modules/mediaBackup/duck'

import { connect } from 'react-redux'

/**
 * ScanMenItem Display the "Scan" item in the "More Menu"
 */
const ScanMenuItem = translate()(({ status, onClick, t, online }) => {
  const offlineMessage = () => {
    return alert(t('Scan.error.offline'))
  }
  const uploadingMessage = () => {
    return alert(t('Scan.error.uploading'))
  }
  const actionOnClick = (() => {
    if (status === SCANNER_UPLOADING) return uploadingMessage
    if (!online) return offlineMessage
    return onClick
  })()

  return (
    <span className="u-pl-1 u-flex u-pt-half u-pb-half" onClick={actionOnClick}>
      <Icon icon="camera" />
      <span className="u-pl-half">{t('Scan.scan_a_doc')}</span>
    </span>
  )
})

/**
 * ScanWrapper is a wrapper of Scanner. It has the responsability to decide of :
 * - generating the filename
 * - Dispatching some events before and after the scan
 * - call the component to render
 */
class ScanWrapper extends Component {
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
          {({ status, error, startScanner, filename, onClear, online }) => {
            if (error || !filename) {
              return (
                <ScanMenuItem
                  status={status}
                  onClick={startScanner}
                  online={online}
                />
              )
            }
            return (
              <>
                <ScanMenuItem
                  status={status}
                  onClick={startScanner}
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
                  successCount={status === SCANNER_DONE ? 1 : 0}
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
)(toolbarContainer(ScanWrapper))
