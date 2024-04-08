import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useQuery } from 'cozy-client'
import { useWebviewIntent } from 'cozy-intent'
import logger from 'cozy-logger'
import Alerter from 'cozy-ui/transpiled/react/deprecated/Alerter'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { ROOT_DIR_ID } from 'constants/config'
import { getErrorMessage } from 'modules/drive/helpers'
import { buildMoveOrImportQuery, buildOnlyFolderQuery } from 'modules/queries'
import { ADD_TO_UPLOAD_QUEUE, purgeUploadQueue } from 'modules/upload'
import {
  FileFromNative,
  Folder,
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
  const [folder, setFolder] = useState<Folder>({ _id: ROOT_DIR_ID })
  const [uploadInProgress] = useState<boolean>(false)
  const dispatch = useDispatch()
  const { t } = useI18n()
  const _contentQuery = buildMoveOrImportQuery(folder._id)
  const _folderQuery = buildOnlyFolderQuery(folder._id)
  const contentQuery = useQuery(
    _contentQuery.definition(),
    _contentQuery.options
  )
  const folderQuery = useQuery(_folderQuery.definition(), _folderQuery.options)

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

  const uploadFilesFromFlagship = useCallback(() => {
    if (!items || items.length === 0 || !webviewIntent) return

    const filesForQueue = generateForQueue(items)

    dispatch({
      type: ADD_TO_UPLOAD_QUEUE,
      files: filesForQueue
    })

    try {
      sendFilesToHandle(filesForQueue, webviewIntent, folder)
      navigate(`/folder/${folder._id}`)
    } catch (error) {
      Alerter.error(t('ImportToDrive.error'))
      logger('info', `uploadFilesFromNative error, ${getErrorMessage(error)}`)
      navigate('/')
    }
  }, [dispatch, folder, items, navigate, t, webviewIntent])

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
    setFolder,
    folder,
    onClose,
    uploadInProgress,
    contentQuery,
    folderQuery,
    items,
    uploadFilesFromFlagship,
    resetFilesToHandle
  }
}
