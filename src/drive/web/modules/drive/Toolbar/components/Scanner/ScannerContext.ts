import React from 'react'

/**
 * Context object for the Scanner component.
 */
export const ScannerContext = React.createContext({
  startScanner: () => Promise.resolve(),
  hasScanner: false
})
