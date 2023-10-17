import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useClient } from 'cozy-client'
import { useWebviewIntent, getErrorMessage } from 'cozy-intent'
import logger from 'cozy-logger'

import {
  getUploadQueue,
  ADD_TO_UPLOAD_QUEUE,
  purgeUploadQueue
} from 'drive/web/modules/upload'
import { FileFromNative } from 'drive/web/modules/views/Upload/UploadTypes'

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
        logger('info', `hasFilesToHandle error, ${getErrorMessage(error)}`)
        dispatch(purgeUploadQueue())
      }
    }

    void doResumeCheck()
  }, [client, dispatch, webviewIntent, uploadQueue])
}
