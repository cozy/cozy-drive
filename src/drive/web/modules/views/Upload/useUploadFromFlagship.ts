/* eslint-disable no-console */
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { useWebviewIntent } from 'cozy-intent'

import logger from 'lib/logger'
import { FileFromNative } from './UploadTypes'
import CozyClient from 'cozy-client'

const typedLogger = logger as unknown & {
  info: (message: string, ...rest: unknown[]) => void
}

interface UploadFromFlagship {
  items?: FileFromNative[]
  uploadFilesFromFlagship: (
    client: CozyClient,
    fileUrl: string,
    fileOptions: {
      name: string
      dirId: string
      conflictStrategy: string
    }
  ) => Promise<void>
  resetFilesToHandle: () => Promise<void>
}

export const useUploadFromFlagship = (): UploadFromFlagship => {
  const webviewIntent = useWebviewIntent()
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState<FileFromNative[]>()
  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')
  const navigate = useNavigate()
  const getFilesToUpload = useCallback(async () => {
    typedLogger.info('getFilesToUpload called')

    try {
      const files = (await webviewIntent?.call(
        'getFilesToUpload'
      )) as unknown as FileFromNative[]

      if (files) {
        typedLogger.info('getFilesToUpload success', { files })

        return setItems(files.map(file => ({ ...file, name: file.fileName })))
      } else {
        typedLogger.info('getFilesToUpload no files to upload')
        throw new Error('No files to upload')
      }
    } catch (error) {
      typedLogger.info('getFilesToUpload error', { error })
      // handle error, maybe show a toast and redirect to the home?
    }
  }, [webviewIntent])

  useEffect(() => {
    if (fromFlagshipUpload && webviewIntent) {
      getFilesToUpload()
        .then(() => {
          return typedLogger.info(
            'getFilesToUpload success, setting didFetch = true'
          )
        })
        .catch((error: unknown) => {
          typedLogger.info('getFilesToUpload error, setting didFetch = true', {
            error
          })
          // handle error, maybe show a toast and redirect to the home?
        })
    }
  }, [fromFlagshipUpload, getFilesToUpload, webviewIntent, navigate])

  return {
    items,
    uploadFilesFromFlagship: async (
      _client,
      fileUrl,
      fileOptions
    ): Promise<void> => {
      try {
        typedLogger.info('uploadFilesFromFlagship called', {
          fileUrl,
          fileOptions
        })
        const response = await webviewIntent?.call(
          'uploadFiles',
          JSON.stringify({ fileUrl, fileOptions })
        )
        typedLogger.info('uploadFilesFromFlagship success', { response })
      } catch (error) {
        typedLogger.info('uploadFilesFromFlagship error', { error })
        // handle error, maybe show a toast and redirect to the home?
      }
    },
    resetFilesToHandle: async (): Promise<void> => {
      try {
        typedLogger.info('resetFilesToHandle called')
        const response = await webviewIntent?.call('resetFilesToHandle')
        typedLogger.info('resetFilesToHandle success', { response })
      } catch (error) {
        typedLogger.info('resetFilesToHandle error', { error })
        // handle error, maybe show a toast and redirect to the home?
      }
    }
  }
}
