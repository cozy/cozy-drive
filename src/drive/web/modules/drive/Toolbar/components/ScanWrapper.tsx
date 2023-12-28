import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import logger from 'cozy-logger'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { isFlagshipApp } from 'cozy-device-helper'
import MuiCozyTheme from 'cozy-ui/transpiled/react/MuiCozyTheme'
import { BreakpointsProvider } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useWebviewIntent, WebviewService } from 'cozy-intent'
import { getErrorMessage } from 'drive/web/modules/drive/helpers'
import { uploadFiles } from 'drive/web/modules/navigation/duck'
import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

export const ScannerContext = React.createContext({
  startScanner: () => Promise.resolve(),
  hasScanner: false
})

const useScanner = (
  webviewIntent?: WebviewService
): { hasScanner: boolean; scanDocument: () => Promise<string> } => {
  const [hasScanner, setHasScanner] = useState(false)

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

const getBlobFromBase64 = (base64: string): Blob => {
  const byteString = atob(base64)
  const mimeString = 'image/jpeg' // Assuming the mime type is image/jpeg
  const byteNumbers = new Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  // Create Blob from the byte array
  return new Blob([byteArray], { type: mimeString })
}

interface ScanWrapperProps {
  children: React.ReactNode
  displayedFolder?: { id: string }
}

const onUploadSuccess = (): null => {
  logger('info', `File uploaded successfully`)
  return null
}

export const ScanWrapper = ({
  children,
  displayedFolder
}: ScanWrapperProps): JSX.Element => {
  const isFolderOnMobileApp = isFlagshipApp() && displayedFolder
  const webviewIntent = useWebviewIntent()
  const { hasScanner, scanDocument } = useScanner(webviewIntent)
  const dispatch = useDispatch()
  const client = useClient()
  const { t } = useI18n()

  const startScanner = useCallback(async () => {
    try {
      if (!displayedFolder) return

      logger('info', 'Starting scanner')
      const base64 = await scanDocument()
      logger(
        'info',
        `Scan done, base64 trimmed: ${base64?.slice(0, 20) + '...'}`
      )
      if (!base64) return Alerter.error('ImportToDrive.error')

      const file = new File([getBlobFromBase64(base64)], 'scan.jpg', {
        type: 'image/jpeg'
      })
      logger('info', 'Got file from base64, uploading to drive')

      dispatch(
        uploadFiles(
          [file],
          displayedFolder.id,
          { isScanned: true },
          onUploadSuccess,
          { client, vaultClient: {}, t }
        )
      )
    } catch (error) {
      logger('error', `startScanner error, ${getErrorMessage(error)}`)
      Alerter.error('ImportToDrive.error')
    }
  }, [displayedFolder, scanDocument, dispatch, client, t])

  if (!isFolderOnMobileApp) return <>{children}</>

  return (
    <BreakpointsProvider>
      <MuiCozyTheme>
        <ScannerContext.Provider value={{ startScanner, hasScanner }}>
          {children}
        </ScannerContext.Provider>
      </MuiCozyTheme>
    </BreakpointsProvider>
  )
}
