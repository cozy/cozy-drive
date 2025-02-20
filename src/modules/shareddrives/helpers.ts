import type { File, FolderPickerEntry } from '@/components/FolderPicker/types'

export const isSharedDriveFolder = (
  file: File | FolderPickerEntry
): boolean => {
  return (
    file._type === 'io.cozy.files' &&
    file.dir_id === 'io.cozy.files.shared-drives-dir' &&
    file.type === 'directory'
  )
}
