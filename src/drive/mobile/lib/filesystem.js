/* global cozy */
import { isAndroid } from './device'

const ERROR_GET_DIRECTORY = 'Error to get directory'
const ERROR_WRITE_FILE = 'Error to write file'
const ERROR_GET_FILE = 'Error to get file'
const COZY_PATH = 'Cozy'
const COZY_FILES_PATH = 'Cozy Drive'

export const getRootPath = () =>
  isAndroid()
    ? window.cordova.file.externalRootDirectory
    : window.cordova.file.dataDirectory

export const getTemporaryRootPath = () =>
  isAndroid()
    ? window.cordova.file.externalCacheDirectory
    : window.cordova.file.cacheDirectory

export const getCozyPath = () => COZY_PATH + '/' + COZY_FILES_PATH + '/'

export const getEntry = path =>
  new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL(path, resolve, reject)
  })

export const getCozyEntry = () =>
  getEntry(getRootPath() + getCozyPath()).catch(() => createCozyPath())

export const createCozyPath = () =>
  getEntry(getRootPath()).then(entry =>
    getDirectory(entry, COZY_PATH).then(entry =>
      getDirectory(entry, COZY_FILES_PATH)
    )
  )

export const getDirectory = (rootDirEntry, folderName) =>
  new Promise((resolve, reject) => {
    rootDirEntry.getDirectory(folderName, { create: true }, resolve, error => {
      console.warn(ERROR_GET_DIRECTORY, folderName)
      console.warn(error)
      reject(ERROR_GET_DIRECTORY)
    })
  })

export const writeFile = (fileEntry, dataObj) =>
  new Promise((resolve, reject) => {
    fileEntry.createWriter(fileWriter => {
      fileWriter.onwriteend = () => {
        resolve(fileEntry)
      }
      fileWriter.onerror = error => {
        console.warn(ERROR_WRITE_FILE)
        console.warn(error)
        reject(ERROR_WRITE_FILE)
      }
      fileWriter.write(dataObj)
    })
  })

const saveFile = (dirEntry, fileData, fileName) =>
  new Promise((resolve, reject) => {
    dirEntry.getFile(
      fileName,
      { create: true, exclusive: false },
      fileEntry => {
        writeFile(fileEntry, fileData)
          .then(() => {
            resolve(fileEntry)
          })
          .catch(reject)
      },
      error => {
        console.warn(ERROR_GET_FILE)
        console.warn(error)
        reject(ERROR_GET_FILE)
      }
    )
  })

export const openFileWithCordova = (URI, mimetype) =>
  new Promise((resolve, reject) => {
    const decodedURI = decodeURIComponent(URI)
    const callbacks = {
      error: reject,
      success: resolve
    }
    window.cordova.plugins.fileOpener2.open(decodedURI, mimetype, callbacks)
  })

export const deleteOfflineFile = async filename => {
  const entry = await getCozyEntry()
  const fileEntry = await getEntry(`${entry.nativeURL}${filename}`)
  return fileEntry.remove()
}

export const saveFileWithCordova = (fileData, fileName) =>
  getCozyEntry().then(entry => saveFile(entry, fileData, fileName))

export const temporarySave = (file, filename) =>
  getEntry(getTemporaryRootPath()).then(entry =>
    saveFile(entry, file, filename)
  )

export const saveAndOpenWithCordova = (file, filename) =>
  temporarySave(file, filename).then(entry =>
    openFileWithCordova(entry.nativeURL, file.type)
  )

export const getNativeFile = async file => {
  const entry = await getCozyEntry()
  return getEntry(`${entry.nativeURL}${file.id}`)
}

export const openOfflineFile = async file => {
  const fileEntry = await getNativeFile(file)
  return openFileWithCordova(fileEntry.nativeURL, file.mime)
}

export const openOnlineFile = async file => {
  const response = await cozy.client.files.downloadById(file.id)
  const blob = await response.blob()
  return saveAndOpenWithCordova(blob, file.name)
}
