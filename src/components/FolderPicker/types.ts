import { IOCozyFile, NextcloudFile } from 'cozy-client/types/types'

export type IOCozyFileWithExtra = IOCozyFile & {
  dir_id: string
  path: string
  cozyMetadata?: {
    createdByApp?: string
    sourceAccount?: string
    favorite?: boolean
  }
  metadata?: {
    instanceName?: string
  }
}

export type File = IOCozyFileWithExtra | NextcloudFile

export interface FolderPickerEntry {
  _id?: string
  _type: string
  type: string
  name: string
  mime: string
  dir_id?: string
  class?: string
  path?: string
}
