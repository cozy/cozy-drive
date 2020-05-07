import React, { Component } from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'

import { Scanner, SCANNER_DONE, SCANNER_UPLOADING } from 'cozy-scanner'
import toolbarContainer from '../toolbar'
import PortaledQueue from './PortaledQueue'

import {
  startMediaBackup,
  cancelMediaBackup
} from 'drive/mobile/modules/mediaBackup/duck'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'

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
  const trackEvent = () => {
    const tracker = getTracker()
    if (tracker) {
      tracker.push(['trackEvent', 'Drive', 'Scanner', 'Scan Click'])
    }
  }

  return (
    <ActionMenuItem
      left={<Icon icon="camera" />}
      onClick={() => {
        trackEvent()
        return actionOnClick()
      }}
    >
      {t('Scan.scan_a_doc')}
    </ActionMenuItem>
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
      // The ActionMenu needs to stay open during the scan, so we prevent the click event from bubbling
      <div onClick={e => e.stopPropagation()}>
        <Scanner
          dirId={displayedFolder.id} //Pour savoir où uploader
          pluginConfig={{
            sourceType: 1 // Camera
          }}
          generateName={() => {
            const date = new Date()
            //We had to replace : by - since the Cordova File plugin doesn't support : in the filename
            //https://github.com/apache/cordova-plugin-file/issues/289#issuecomment-477954331
            return `Scan_${date.toISOString().replace(/:/g, '-')}.jpg`
          }}
          onConflict={'rename'}
          //We need to cancel the MediaBackup before doing the upload since the scanned file will be
          //inserted we don't know where in the queue resulting in a non uploaded file if the queue is
          //big enough
          onBeforeUpload={() => stopMediaBackup()}
          onFinish={() => {
            const tracker = getTracker()
            if (tracker) {
              tracker.push(['trackEvent', 'Drive', 'Scanner', 'Finished'])
            }
            startMediaBackup()
          }}
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
      </div>
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
