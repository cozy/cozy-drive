import { FileFromNative, FileForQueue } from '../UploadTypes'

export const webviewIntent = {
  call: (
    methodName: string,
    files?: FileFromNative[] | FileForQueue[]
  ): Promise<FileFromNative[] | void> => {
    if (methodName === 'getFilesToHandle') {
      return Promise.resolve([
        {
          fileName: 'test.pdf',
          type: 'application/pdf',
          size: 1000,
          lastModified: 123456789
        }
      ])
    }
    if (methodName === 'uploadFiles') {
      return Promise.resolve(files?.map(file => file as FileFromNative))
    }
    if (methodName === 'resetFilesToHandle') {
      return Promise.resolve()
    }
    return Promise.resolve()
  }
}
