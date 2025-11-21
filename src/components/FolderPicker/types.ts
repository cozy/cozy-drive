import { IOCozyFile, NextcloudFile } from 'cozy-client/types/types'

export type File = (IOCozyFile | NextcloudFile) & {
  cozyMetadata?: {
    createdOn?: string
  }
  attributes?: {
    cozyMetadata?: {
      createdOn?: string
    }
  }
}

export interface FolderPickerEntry {
  _id?: string
  _type: string
  type: string
  name: string
  mime: string
  dir_id?: string
  class?: string
  path?: string
  driveId?: string
}
