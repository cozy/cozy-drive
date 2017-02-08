const ERROR_GET_DIRECTORY = 'Error to get directory'
const ERROR_WRITE_FILE = 'Error to write file'
const ERROR_GET_FILE = 'Error to get file'
const COZY_PATH = 'Cozy'
const COZY_FILES_PATH = 'Cozy Files'

export const getRootPath = () => window.cordova.platformId === 'android'
  ? window.cordova.file.externalRootDirectory
  : window.cordova.file.dataDirectory

export const getTemporaryRootPath = () => window.cordova.platformId === 'android'
  ? window.cordova.file.externalCacheDirectory
  : window.cordova.file.cacheDirectory

export const getCozyPath = () => COZY_PATH + '/' + COZY_FILES_PATH + '/'

export const getEntry = (path) => new Promise((resolve, reject) => {
  window.resolveLocalFileSystemURL(path, resolve, reject)
})

export const getCozyEntry = () => new Promise((resolve, reject) => {
  getEntry(getRootPath() + getCozyPath())
  .then(resolve)
  .catch(() => {
    createCozyPath().then(resolve).catch(reject)
  })
})

export const createCozyPath = () => new Promise((resolve, reject) => {
  getEntry(getRootPath())
  .then(entry => {
    getDirectory(entry, COZY_PATH).then(entry => {
      getDirectory(entry, COZY_FILES_PATH).then(resolve).catch(reject)
    }).catch(reject)
  }).catch(reject)
})

export const getDirectory = (rootDirEntry, folderName) => new Promise((resolve, reject) => {
  rootDirEntry.getDirectory(folderName, { create: true }, resolve, error => {
    console.warn(ERROR_GET_DIRECTORY, folderName)
    console.warn(error)
    reject(ERROR_GET_DIRECTORY)
  })
})

export const writeFile = (fileEntry, dataObj) => new Promise((resolve, reject) => {
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

export const saveFile = (dirEntry, fileData, fileName) => new Promise((resolve, reject) => {
  dirEntry.getFile(fileName, { create: true, exclusive: false }, fileEntry => {
    writeFile(fileEntry, fileData).then(() => {
      resolve(fileEntry)
    }).catch(reject)
  }, error => {
    console.warn(ERROR_GET_FILE)
    console.warn(error)
    reject(ERROR_GET_FILE)
  })
})

export const saveFileWithCordova = (fileData, fileName) => new Promise((resolve, reject) => {
  getCozyEntry()
  .then(entry => saveFile(entry, fileData, fileName).then(resolve).catch(reject))
  .catch(reject)
})

export const openFileWithCordova = (fileData, filename) => new Promise((resolve, reject) => {
  const fileMIMEType = fileData.type
  getEntry(getTemporaryRootPath())
  .then(dirEntry => saveFile(dirEntry, fileData, filename)
    .then(fileEntry => window.cordova.plugins.fileOpener2.open(fileEntry.nativeURL, fileMIMEType, { error: reject, success: resolve }))
    .catch(reject)
  )
  .catch(reject)
})
