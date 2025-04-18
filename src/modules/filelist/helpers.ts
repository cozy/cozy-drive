import { splitFilename } from 'cozy-client/dist/models/file'

import type { File } from '@/components/FolderPicker/types'
import { TRASH_DIR_ID } from '@/constants/config'
import { isNextcloudShortcut } from '@/modules/nextcloud/helpers'

export const getFileNameAndExtension = (
  file: File,
  t: (key: string) => string
): {
  title: string
  filename: string
  extension?: string
} => {
  const { filename, extension } = splitFilename(file)

  if (file._id === TRASH_DIR_ID) {
    return {
      title: t('FileName.trash'),
      filename: t('FileName.trash')
    }
  }

  if (file._id === 'io.cozy.files.shared-drives-dir') {
    return {
      title: t('FileName.sharedDrive'),
      filename: t('FileName.sharedDrive')
    }
  }

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
