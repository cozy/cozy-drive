import React, { useContext } from 'react'

import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CameraIcon from 'cozy-ui/transpiled/react/Icons/Camera'

import { ScannerContext } from './ScannerContext'

/**
 * Renders a scanner menu item.
 * @returns The JSX element representing the scanner menu item.
 */
export const ScannerMenuItem = (): JSX.Element => {
  const { t } = useI18n()
  const scannerContext = useContext(ScannerContext)

  return scannerContext.hasScanner ? (
    <ActionMenuItem
      onClick={scannerContext?.startScanner}
      left={<Icon icon={CameraIcon} />}
    >
      {t('Scan.scan_a_doc')}
    </ActionMenuItem>
  ) : (
    <></>
  )
}
