import CozyClient from 'cozy-client'

export interface Folder {
  _id: string
}

export interface FileForQueue {
  file: FileFromNative
  isDirectory: false
}

export interface DumbUploadProps {
  t: (key: string, options?: { smart_count: number }) => string
  stopMediaBackup: () => void
  navigate: (path: string) => void
  uploadFilesFromNative: DispatchProps['uploadFilesFromNative']
  client: CozyClient
  vaultClient: CozyClient
  startMediaBackup: () => void
  items: FileFromNative[]
}

export interface DispatchProps {
  uploadFilesFromNative: (
    files: FileForQueue[],
    folderId: string,
    successCallback: () => void,
    options: { client: CozyClient; vaultClient?: CozyClient },
    alternateUploader?: (
      files: FileForQueue[],
      folderId: string
    ) => Promise<void>
  ) => Promise<void>
  stopMediaBackup: () => void
  startMediaBackup: () => void
}

export interface FileFromNative {
  fileName: string
}
