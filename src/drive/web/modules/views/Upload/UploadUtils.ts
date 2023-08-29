import type { FileFromNative, FileForQueue } from './UploadTypes'

export const generateForQueue = (files: FileFromNative[]): FileForQueue[] => {
  // @ts-expect-error fix types
  return files.map(file => ({ file: file, isDirectory: false }))
}
