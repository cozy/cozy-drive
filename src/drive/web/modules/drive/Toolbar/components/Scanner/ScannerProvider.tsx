import React from 'react'

import { isFlagshipApp } from 'cozy-device-helper'
import { BreakpointsProvider, MuiCozyTheme } from 'cozy-ui/transpiled/react'

import { ScannerContext } from './ScannerContext'
import { useStartScanner } from './useStartScanner'
import { useScanner } from './useScanner'

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
