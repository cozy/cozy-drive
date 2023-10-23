import { UseQueryReturnValue } from 'cozy-client/types/types'

export interface Folder {
  _id: string
}

export interface FileForQueue {
  name: string
  file?: { name: string }
  isDirectory?: false
}

export interface FileFromNative {
  name: string
  file: {
    weblink: null
    text: null
    filePath: string
    contentUri: string
    subject: null
    extension: string
    fileName: string
    mimeType: string
    dirId?: string
    conflictStrategy?: string
  }
  status: number
}

export interface UploadFromFlagship {
  items?: FileFromNative['file'][]
  uploadFilesFromFlagship: (fileOptions: {
    name: string
    dirId: string
    conflictStrategy: string
  }) => void
  resetFilesToHandle: () => Promise<void>
  onClose: () => Promise<void>
  uploadInProgress: boolean
  contentQuery: UseQueryReturnValue
  folderQuery: UseQueryReturnValue
  setFolder: React.Dispatch<React.SetStateAction<Folder>>
  folder: Folder
}
