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

/**
 * Extract the sharing id from a file/folder relationships.referenced_by
 * Returns undefined if not referenced by a sharing
 */
export const getSharingIdFromRelationships = (doc: {
  relationships?: {
    referenced_by?: { data?: { id: string; type: string }[] }
  }
}): string | undefined =>
  doc.relationships?.referenced_by?.data?.find(
    ref => ref.type === 'io.cozy.sharings'
  )?.id

export const isSharedDriveFolder = (
  file: File | FolderPickerEntry
): boolean => {
  return (
    file._type === 'io.cozy.files' &&
    file.dir_id === 'io.cozy.files.shared-drives-dir' &&
    file.type === 'directory'
  )
}
