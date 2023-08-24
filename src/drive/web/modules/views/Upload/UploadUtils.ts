import type { FileFromNative, FileForQueue } from './UploadTypes'

export const generateForQueue = (files: FileFromNative[]): FileForQueue[] => {
  return files.map(file => ({ file: file, isDirectory: false }))
}
