import React, { useContext } from 'react'

import { SCANNER_UPLOADING } from 'cozy-scanner'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CameraIcon from 'cozy-ui/transpiled/react/Icons/Camera'

import { ScannerContext } from './ScanWrapper'

const StartScanner = ({ t }) => {
  const scannerContextValue = useContext(ScannerContext)
  if (!scannerContextValue) return null
  const { status, online, startScanner } = scannerContextValue

  const offlineMessage = () => {
    return alert(t('Scan.error.offline'))
  }
  const uploadingMessage = () => {
    return alert(t('Scan.error.uploading'))
  }

  const actionOnClick = (() => {
    if (status === SCANNER_UPLOADING) return uploadingMessage
    if (!online) return offlineMessage
    return startScanner
  })()

  return (
    <ActionMenuItem
      onClick={() => {
        actionOnClick()
      }}
      left={<Icon icon={CameraIcon} />}
    >
      {t('Scan.scan_a_doc')}
    </ActionMenuItem>
  )
}

export default translate()(StartScanner)
