import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import CameraIcon from 'cozy-ui/transpiled/react/Icons/Camera'
import { ActionMenuItem } from 'cozy-ui/transpiled/react/deprecated/ActionMenu'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { useScannerContext } from 'modules/drive/Toolbar/components/Scanner/ScannerProvider'

/**
 * Renders a scanner menu item.
 * @returns The JSX element representing the scanner menu item.
 */
export const ScannerMenuItem = (): JSX.Element | null => {
  const { t } = useI18n()
  const { hasScanner, startScanner } = useScannerContext()

  return hasScanner ? (
    <div data-testid="scan-doc">
      <ActionMenuItem
        onClick={startScanner}
        left={<Icon icon={CameraIcon} />}
        data-testid="scan-doc"
      >
        {t('Scan.scan_a_doc')}
      </ActionMenuItem>
    </div>
  ) : null
}
