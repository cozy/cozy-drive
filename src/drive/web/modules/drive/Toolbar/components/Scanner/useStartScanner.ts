import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useClient } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'
import logger from 'cozy-logger'
import { Alerter } from 'cozy-ui/transpiled/react'

import { uploadFiles } from 'drive/web/modules/navigation/duck'
import { useScanner } from 'drive/web/modules/drive/Toolbar/components/Scanner/useScanner'
import {
  getBlobFromBase64,
  getErrorMessage
} from 'drive/web/modules/drive/helpers'

/**
 * Custom hook that starts the scanner and uploads the scanned document to the drive.
 * @param displayedFolder The folder where the scanned document will be uploaded.
 * @returns A function that starts the scanner and uploads the scanned document.
 */
export const useStartScanner = (displayedFolder: {
  id: string
}): (() => Promise<void>) => {
  const { scanDocument } = useScanner()
  const dispatch = useDispatch()
  const client = useClient()
  const { t } = useI18n()

  return useCallback(async () => {
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
          () => logger('info', `File uploaded successfully`),
          { client, vaultClient: {}, t }
        )
      )
    } catch (error) {
      logger('error', `startScanner error, ${getErrorMessage(error)}`)
      Alerter.error('ImportToDrive.error')
    }
  }, [displayedFolder, scanDocument, dispatch, client, t])
}
