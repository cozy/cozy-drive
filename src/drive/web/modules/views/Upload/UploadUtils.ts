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
