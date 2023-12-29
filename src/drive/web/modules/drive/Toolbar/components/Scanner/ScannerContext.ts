import React from 'react'

interface ScannerContextValue {
  startScanner?: () => Promise<void>
  hasScanner: boolean
}

/**
 * Context object for the Scanner component.
 */
export const ScannerContext = React.createContext<ScannerContextValue>({
  startScanner: undefined,
  hasScanner: false
})

export const useScannerContext = (): ScannerContextValue =>
  React.useContext(ScannerContext)
