/* eslint-disable no-console */
import { useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import { FileForQueue, FileFromNative } from './UploadTypes'

// eslint-disable-next-line no-console
const webviewIntent = {
  call: (
    methodName: string,
    files?: FileFromNative[] | FileForQueue[]
  ): Promise<FileFromNative[] | void> => {
    if (methodName === 'getFilesToUpload') {
      return Promise.resolve([
        {
          fileName: 'test.pdf',
          type: 'application/pdf',
          size: 1000,
          lastModified: 123456789
        }
      ])
    }
    if (methodName === 'uploadFiles') {
      console.log('uploadFiles', files)
      return Promise.resolve()
    }
    if (methodName === 'resetFilesToHandle') {
      console.log('resetFilesToHandle')
      return Promise.resolve()
    }
    return Promise.resolve()
  }
}

interface UploadFromFlagship {
  items?: FileFromNative[]
  uploadFilesFromFlagship: (files: FileForQueue[]) => Promise<void>
  resetFilesToHandle: () => Promise<void>
}

export const useUploadFromFlagship = (): UploadFromFlagship => {
  const [searchParams] = useSearchParams()
  const [filesToUpload, setFilesToUpload] = useState<FileFromNative[]>()
  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')
  const didFetch = useRef(false)

  useEffect(() => {
    if (fromFlagshipUpload && webviewIntent && !didFetch.current) {
      webviewIntent
        .call('getFilesToUpload')
        .then(files => {
          didFetch.current = true

          if (files) {
            return setFilesToUpload(
              files.map(file => ({ ...file, name: file.fileName }))
            )
          } else {
            throw new Error('No files to upload')
          }
        })
        .catch(() => {
          // handle error, maybe show a toast and redirect to the home?
        })
    }
  }, [fromFlagshipUpload])

  return {
    items: filesToUpload,
    uploadFilesFromFlagship: async (files: FileForQueue[]): Promise<void> => {
      try {
        await webviewIntent.call('uploadFiles', files)
      } catch (error) {
        // handle error, maybe show a toast and redirect to the home?
      }
    },
    resetFilesToHandle: async (): Promise<void> => {
      try {
        await webviewIntent.call('resetFilesToHandle')
      } catch (error) {
        // handle error, maybe show a toast and redirect to the home?
      }
    }
  }
}
