import React, { useContext } from 'react'

import { useScannerService } from 'drive/web/modules/drive/Toolbar/components/Scanner/useScannerService'

interface ScannerContextValue {
  startScanner?: () => Promise<void>
  hasScanner: boolean
}

interface ScannerProviderProps {
  children: React.ReactNode
  displayedFolder: { id: string }
}

/**
 * Context object for the Scanner component.
 */
export const ScannerContext = React.createContext<ScannerContextValue>({
  startScanner: undefined,
  hasScanner: false
})

export const useScannerContext = (): ScannerContextValue =>
  useContext(ScannerContext)

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
  const scanner = useScannerService(displayedFolder)

  return (
    <ScannerContext.Provider value={scanner}>
      {children}
    </ScannerContext.Provider>
  )
}
