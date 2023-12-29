import React from 'react'

import { isFlagshipApp } from 'cozy-device-helper'
import { BreakpointsProvider, MuiCozyTheme } from 'cozy-ui/transpiled/react'

import { ScannerContext } from 'drive/web/modules/drive/Toolbar/components/Scanner/ScannerContext'
import { useStartScanner } from 'drive/web/modules/drive/Toolbar/components/Scanner/useStartScanner'
import { useScanner } from 'drive/web/modules/drive/Toolbar/components/Scanner/useScanner'

interface ScannerProviderProps {
  children: React.ReactNode
  displayedFolder: { id: string }
}

/**
 * Provides the scanner functionality.
 *
 * @param props - The component props.
 * @returns The scanner provider component.
 */
export const ScannerProvider = ({
  children,
  displayedFolder
}: ScannerProviderProps): JSX.Element => {
  const isFolderOnMobileApp = isFlagshipApp() && displayedFolder
  const { hasScanner } = useScanner()
  const startScanner = useStartScanner(displayedFolder)

  return isFolderOnMobileApp ? (
    <BreakpointsProvider>
      <MuiCozyTheme>
        <ScannerContext.Provider value={{ startScanner, hasScanner }}>
          {children}
        </ScannerContext.Provider>
      </MuiCozyTheme>
    </BreakpointsProvider>
  ) : (
    <>{children}</>
  )
}
