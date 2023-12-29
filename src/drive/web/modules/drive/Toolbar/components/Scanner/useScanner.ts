import { useState, useEffect } from 'react'

import logger from 'cozy-logger'
import { useWebviewIntent } from 'cozy-intent'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import { getErrorMessage } from 'drive/web/modules/drive/helpers'

/**
 * Custom hook that provides scanner functionality.
 * @returns An object with the following properties:
 *   - hasScanner: A boolean indicating whether the scanner is available.
 *   - scanDocument: A function that returns a promise resolving to a string representing the scanned document in base64 format.
 */
export const useScanner = (): {
  hasScanner: boolean
  scanDocument: () => Promise<string>
} => {
  const [hasScanner, setHasScanner] = useState(false)
  const webviewIntent = useWebviewIntent()

  useEffect(() => {
    const initScanner = async (): Promise<void> => {
      try {
        const res = await webviewIntent?.call('isAvailable', 'scanner')
        setHasScanner(Boolean(res))
      } catch (error) {
        logger('error', `initScanner error, ${getErrorMessage(error)}`)
      }
    }

    if (webviewIntent) {
      void initScanner()
    }
  }, [webviewIntent])

  const scanDocument = async (): Promise<string> => {
    try {
      const base64 = (await webviewIntent?.call(
        'scanDocument'
      )) as unknown as string

      if (!base64) throw new Error('No base64 returned by scanDocument')

      return base64
    } catch (error) {
      logger('error', `scanDocument error, ${getErrorMessage(error)}`)
      Alerter.error('ImportToDrive.error')
      return ''
    }
  }

  return { hasScanner, scanDocument }
}
