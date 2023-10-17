import { WebviewService } from 'cozy-intent'
import logger from 'cozy-logger'

import {
  RECEIVE_UPLOAD_ERROR,
  RECEIVE_UPLOAD_SUCCESS
} from 'drive/web/modules/upload'
import type {
  FileFromNative,
  FileForQueue
} from 'drive/web/modules/views/Upload/UploadTypes'

export const generateForQueue = (
  files: FileFromNative['file'][]
): FileForQueue[] => {
  // @ts-expect-error fix types
  return files.map(file => ({ file: file, isDirectory: false }))
}

export const onFileUploaded = (
  data: {
    file: FileFromNative
    isSuccess: boolean
  },
  dispatch: (arg0: { type: string; file: FileFromNative }) => void
): void => {
  if (!data.file) return

  if (!(data.file.status === 2)) {
    dispatch({ type: RECEIVE_UPLOAD_ERROR, file: data.file })
  } else {
    dispatch({ type: RECEIVE_UPLOAD_SUCCESS, file: data.file })
  }
}

export const shouldRender = (
  items?: FileFromNative['file'][]
): items is FileFromNative['file'][] => !!items && items.length > 0

interface ErrorWithMessage {
  message: string
}

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  )
}

const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

export const getErrorMessage = (error: unknown): string => {
  return toErrorWithMessage(error).message
}

export const getFilesToHandle = async (
  webviewIntent: WebviewService
): Promise<Array<FileFromNative['file'] & { name: string }>> => {
  logger('info', 'getFilesToHandle called')

  const files = (await webviewIntent?.call(
    'getFilesToHandle'
  )) as unknown as FileFromNative[]

  if (files?.length === 0) throw new Error('No files to upload')

  if (files.length > 0) {
    logger('info', 'getFilesToHandle success')

    return files.map(fileFromNative => ({
      ...fileFromNative.file,
      name: fileFromNative.file.fileName
    }))
  } else {
    logger('info', 'getFilesToHandle no files to upload')
    throw new Error('No files to upload')
  }
}

export const sendFilesToHandle = async (
  filesForQueue: FileForQueue[],
  webviewIntent: WebviewService,
  folder: { _id: string }
): Promise<void> => {
  for (const file of filesForQueue) {
    if (!file.file) throw new Error('No file to upload')

    const fileOptions = {
      name: file.file.name,
      dirId: folder._id,
      conflictStrategy: 'rename'
    }

    logger('info', 'uploadFilesFromFlagship called')

    await webviewIntent?.call('uploadFiles', JSON.stringify({ fileOptions }))

    logger('info', 'uploadFilesFromFlagship success')
  }
}
