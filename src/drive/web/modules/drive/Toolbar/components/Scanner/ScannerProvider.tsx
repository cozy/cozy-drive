import React from 'react'

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
  const scanner = useScanner()
  const startScanner = useStartScanner(displayedFolder)

  return (
    <ScannerContext.Provider
      value={{ startScanner, hasScanner: scanner.hasScanner }}
    >
      {children}
    </ScannerContext.Provider>
  )
}
