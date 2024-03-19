import React, { createContext, useMemo, useCallback, useContext } from 'react'

import { getBoundT } from 'cozy-client/dist/models/document/locales'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

const ScannerI18nContext = createContext()

const prefix = `Scan`
export const ScannerI18nProvider = ({ children }) => {
  const { lang } = useI18n()
  const scannerI18n = useMemo(() => getBoundT(lang || 'fr'), [lang])

  const scannerT = useCallback(
    (key, opts) => scannerI18n(`${prefix}.${key}`, opts),
    [scannerI18n]
  )

  return (
    <ScannerI18nContext.Provider value={scannerT}>
      {children}
    </ScannerI18nContext.Provider>
  )
}

export const useScannerI18n = () => {
  const scannerT = useContext(ScannerI18nContext)
  if (!scannerT) {
    throw new Error(
      'ScannerI18nContext must be used within a ScannerI18nProvider'
    )
  }

  return scannerT
}
