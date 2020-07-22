import React, { useContext } from 'react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { getTracker } from 'cozy-ui/transpiled/react/helpers/tracker'
import { SCANNER_UPLOADING } from 'cozy-scanner'
import { ScannerContext } from './ScanWrapper'

const StartScanner = ({ t }) => {
  const { status, online, startScanner } = useContext(ScannerContext)

  const offlineMessage = () => {
    return alert(t('Scan.error.offlinee'))
  }
  const uploadingMessage = () => {
    return alert(t('Scan.error.uploading'))
  }

  const actionOnClick = (() => {
    if (status === SCANNER_UPLOADING) return uploadingMessage
    if (!online) return offlineMessage
    return startScanner
  })()

  const trackEvent = () => {
    const tracker = getTracker()
    if (tracker) {
      tracker.push(['trackEvent', 'Drive', 'Scanner', 'Scan Click'])
    }
  }

  return (
    <ActionMenuItem
      onClick={() => {
        trackEvent()
        actionOnClick()
      }}
      left={<Icon icon="camera" />}
    >
      {t('Scan.scan_a_doc')}
    </ActionMenuItem>
  )
}

export default translate()(StartScanner)
