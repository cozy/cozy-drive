import CozyClient from 'cozy-client'

export interface Folder {
  _id: string
}

export interface FileForQueue {
  name: string
  file?: { name: string }
  isDirectory?: false
}

export interface DumbUploadProps {
  t: (key: string, options?: { smart_count: number }) => string
  stopMediaBackup: () => void
  navigate: (path: string) => void
  uploadFilesFromNative: DispatchProps['uploadFilesFromNative']
  removeFileToUploadQueue: DispatchProps['removeFileToUploadQueue']
  client: CozyClient
  vaultClient: CozyClient
  startMediaBackup: () => void
  items: FileFromNative[]
}

export interface DispatchProps {
  removeFileToUploadQueue: (file: FileForQueue) => Promise<void>
  uploadFilesFromNative: (
    files: FileForQueue[],
    folderId: string,
    successCallback?: () => void,
    options?: { client: CozyClient; vaultClient?: CozyClient },
    alternateUploader?: (
      client: CozyClient,
      fileUrl: string,
      fileOptions: {
        name: string
        dirId: string
        conflictStrategy: string
      }
    ) => Promise<void>
  ) => Promise<void>
  stopMediaBackup: () => void
  startMediaBackup: () => void
}

export interface FileFromNative {
  fileName: string
}
