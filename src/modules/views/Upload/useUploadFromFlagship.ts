import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useWebviewIntent } from 'cozy-intent'
import logger from 'cozy-logger'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { getErrorMessage } from 'modules/drive/helpers'
import { ADD_TO_UPLOAD_QUEUE, purgeUploadQueue } from 'modules/upload'
import {
  FileFromNative,
  UploadFromFlagship
} from 'modules/views/Upload/UploadTypes'
import {
  generateForQueue,
  getFilesToHandle,
  sendFilesToHandle
} from 'modules/views/Upload/UploadUtils'

export const useUploadFromFlagship = (): UploadFromFlagship => {
  const webviewIntent = useWebviewIntent()
  const [searchParams] = useSearchParams()
  const [items, setItems] = useState<FileFromNative['file'][]>()
  const fromFlagshipUpload = searchParams.get('fromFlagshipUpload')
  const navigate = useNavigate()
  const [uploadInProgress] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { t } = useI18n()

  useEffect(() => {
    const asyncGetFilesToHandle = async (): Promise<void> => {
      if (fromFlagshipUpload && webviewIntent) {
        try {
          const files = await getFilesToHandle(webviewIntent)
          setItems(files)
          logger('info', 'getFilesToHandle success, setting didFetch = true')
        } catch (error) {
          logger(
            'info',
            `getFilesToHandle error, setting didFetch = true, ${getErrorMessage(
              error
            )}`
          )
          Alerter.error('ImportToDrive.error')
          navigate('/')
        }
      }
    }

    void asyncGetFilesToHandle()
  }, [fromFlagshipUpload, webviewIntent, navigate])

  const uploadFilesFromFlagship = useCallback(
    (folderId: string) => {
      if (!items || items.length === 0 || !webviewIntent) return

      const filesForQueue = generateForQueue(items)

      dispatch({
        type: ADD_TO_UPLOAD_QUEUE,
        files: filesForQueue
      })

      try {
        sendFilesToHandle(filesForQueue, webviewIntent, folderId)
        navigate(`/folder/${folderId}`)
      } catch (error) {
        Alerter.error(t('ImportToDrive.error'))
        logger('info', `uploadFilesFromNative error, ${getErrorMessage(error)}`)
        navigate('/')
      }
    },
    [dispatch, items, navigate, t, webviewIntent]
  )

  const onClose = useCallback(async () => {
    await webviewIntent?.call('cancelUploadByCozyApp')
    dispatch(purgeUploadQueue())
    navigate('/')
  }, [dispatch, navigate, webviewIntent])

  const resetFilesToHandle = useCallback(async () => {
    try {
      logger('info', 'resetFilesToHandle called')
      await webviewIntent?.call('resetFilesToHandle')
      logger('info', 'resetFilesToHandle success')
    } catch (error) {
      logger('info', `resetFilesToHandle error, ${getErrorMessage(error)}`)
      // Don't need to show a notification to the user here, just redirect to the home
      navigate('/')
    }
  }, [navigate, webviewIntent])

  return {
    onClose,
    uploadInProgress,
    items,
    uploadFilesFromFlagship,
    resetFilesToHandle
  }
}
