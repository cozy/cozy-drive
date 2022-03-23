import React from 'react'

import { Scanner, SCANNER_DONE } from 'cozy-scanner'
import { isMobileApp } from 'cozy-device-helper'
import PortaledQueue from './PortaledQueue'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import {
  startMediaBackup,
  cancelMediaBackup
} from 'drive/mobile/modules/mediaBackup/duck'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'

import toolbarContainer from '../toolbar'
import { connect } from 'react-redux'

export const ScannerContext = React.createContext()

/**
 * ScanWrapper is a wrapper of Scanner. It has the responsability to :
 * - generating the filename
 * - Dispatching some events before and after the scan
 * - make the scan infos available through a context
 */
const ScanWrapper = ({
  displayedFolder,
  stopMediaBackup,
  startMediaBackup,
  children
}) => {
  const isFolderOnMobileApp = isMobileApp() && displayedFolder
  if (!isFolderOnMobileApp) return children

  return (
    <BreakpointsProvider>
      <MuiCozyTheme>
        <Scanner
          dirId={displayedFolder.id} // Pour savoir où uploader
          pluginConfig={{
            sourceType: 1 // Camera
          }}
          generateName={() => {
            const date = new Date()
            // We had to replace : by - since the Cordova File plugin doesn't support : in the filename
            // https://github.com/apache/cordova-plugin-file/issues/289#issuecomment-477954331
            return `Scan_${date.toISOString().replace(/:/g, '-')}.jpg`
          }}
          onConflict={'rename'}
          // We need to cancel the MediaBackup before doing the upload since the scanned file will be
          // inserted we don't know where in the queue resulting in a non uploaded file if the queue is
          // big enough
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
            return (
              <ScannerContext.Provider
                value={{ startScanner, status, error, online }}
              >
                {children}
                {filename && (
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
                )}
              </ScannerContext.Provider>
            )
          }}
        </Scanner>
      </MuiCozyTheme>
    </BreakpointsProvider>
  )
}

const mapDispatchToProps = dispatch => ({
  stopMediaBackup: () => dispatch(cancelMediaBackup()),
  startMediaBackup: () => dispatch(startMediaBackup())
})

export default connect(null, mapDispatchToProps)(toolbarContainer(ScanWrapper))
