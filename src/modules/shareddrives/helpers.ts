import type { File, FolderPickerEntry } from '@/components/FolderPicker/types'

// Temporary type, need to be completed and then put in cozy-client
export interface SharedDrive {
  _id: string
  rules: Rule[]
}

export interface Rule {
  title: string
  values: string[]
}

export const isSharedDriveFolder = (
  file: File | FolderPickerEntry
): boolean => {
  return (
    file._type === 'io.cozy.files' &&
    file.dir_id === 'io.cozy.files.shared-drives-dir' &&
    file.type === 'directory'
  )
}
