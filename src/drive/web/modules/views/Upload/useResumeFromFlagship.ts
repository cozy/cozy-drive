import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useClient } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import logger from 'cozy-logger'

import { getUploadQueue, ADD_TO_UPLOAD_QUEUE } from 'drive/web/modules/upload'
import { FileFromNative } from 'drive/web/modules/views/Upload/UploadTypes'
import { getErrorMessage } from 'drive/web/modules/drive/helpers'

export const useResumeUploadFromFlagship = (): void => {
  const client = useClient()
  const dispatch = useDispatch()
  const webviewIntent = useWebviewIntent()
  const uploadQueue = useSelector(getUploadQueue) as FileFromNative[]

  useEffect(() => {
    const doResumeCheck = async (): Promise<void> => {
      if (!webviewIntent) return
      // If we are on the upload page, we don't want to resume
      if (uploadQueue?.length > 0) return

      try {
        const { filesToHandle } = (await webviewIntent.call(
          'hasFilesToHandle'
        )) as unknown as {
          filesToHandle: FileFromNative[]
        }

        if (!filesToHandle || filesToHandle.length === 0) return

        dispatch({
          type: ADD_TO_UPLOAD_QUEUE,
          files: filesToHandle
        })
      } catch (error) {
        const errorMessage = getErrorMessage(error)
        logger('info', `hasFilesToHandle error, ${errorMessage}`)

        // It means we're on a cozy-flagship version that doesn't handle file sharing
        // In that case we don't want to do anything and just let the upload queue empty
        if (errorMessage.includes('has not been implemented')) return
      }
    }

    void doResumeCheck()
  }, [client, dispatch, webviewIntent, uploadQueue])
}
