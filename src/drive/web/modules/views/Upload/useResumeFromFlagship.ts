import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useClient } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import logger from 'cozy-logger'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'

import {
  getUploadQueue,
  ADD_TO_UPLOAD_QUEUE,
  getProcessed,
  getSuccessful
} from 'drive/web/modules/upload'
import { FileFromNative } from 'drive/web/modules/views/Upload/UploadTypes'
import { getErrorMessage } from 'drive/web/modules/drive/helpers'

export const useResumeUploadFromFlagship = (): void => {
  const client = useClient()
  const dispatch = useDispatch()
  const webviewIntent = useWebviewIntent()
  const uploadQueue = useSelector(getUploadQueue) as FileFromNative[]
  const state = useSelector(state => state)
  const didFlow = useRef(false)

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

  useEffect(() => {
    // The upload can only happen once as the webapp is closed before the upload process can start again
    if (didFlow.current) return

    const processed = (getProcessed(state) as () => unknown[]).length
    const queued = uploadQueue.length

    // If there are no files processed, we are not in the upload flow
    if (processed === 0) return

    // Assuming that the upload is finished if all files have been processed (success or error)
    if (processed === queued) {
      const successful = (getSuccessful(state) as () => unknown[]).length

      // Using success count instead of queued count because some files may have been skipped/errored
      Alerter.success('UploadQueue.success_flagship', {
        smart_count: successful
      })

      didFlow.current = true
    }
  }, [dispatch, state, uploadQueue])
}
