import { splitFilename } from 'cozy-client/dist/models/file'

import type { File } from '@/components/FolderPicker/types'
import {
  TRASH_DIR_ID,
  ROOT_DIR_ID,
  SHARED_DRIVES_DIR_ID
} from '@/constants/config'
import { isNextcloudShortcut } from '@/modules/nextcloud/helpers'

export const makeParentFolderPath = (file: File): string => {
  if (!file.path) return ''

  return file.dir_id === ROOT_DIR_ID
    ? file.path.replace(file.name, '')
    : file.path.replace(`/${file.name}`, '')
}

export const getFileNameAndExtension = (
  file: File,
  t: (key: string) => string
): {
  title: string
  filename: string
  extension?: string
} => {
  if (file._id === TRASH_DIR_ID) {
    return {
      title: t('FileName.trash'),
      filename: t('FileName.trash')
    }
  }

  if (file._id === SHARED_DRIVES_DIR_ID || file._id === ROOT_DIR_ID) {
    return {
      title: t('FileName.sharedDrive'),
      filename: t('FileName.sharedDrive')
    }
  }

  const { filename, extension } = splitFilename(file)

  if (file._type === 'io.cozy.files' && isNextcloudShortcut(file)) {
    return {
      title: filename,
      filename: filename
    }
  }

  return {
    title: file.name,
    filename,
    extension
  }
}
