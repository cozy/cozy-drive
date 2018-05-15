import { getEntry } from './filesystem'
import { alertShow } from '../../ducks/alerter/index'
import { addToUploadQueue } from '../../ducks/upload/index'
import { ROOT_DIR_ID } from '../../constants/config'
import { uploadedFile, uploadQueueProcessed } from '../../actions/index'

const getFile = dirEntry =>
  new Promise((resolve, reject) => {
    dirEntry.file(file => {
      // window.File is modified by cordova, so we need this trick
      const reader = new FileReader()
      reader.onloadend = function() {
        const blob = new Blob([new Uint8Array(this.result)], {
          type: file.type
        })
        const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
        const regex = new RegExp(`.${ext}$`)
        blob.name = regex.test(file.name) ? file.name : `${file.name}.${ext}`
        blob.lastModifiedDate = new Date(file.lastModifiedDate)
        resolve(blob)
      }
      reader.readAsArrayBuffer(file)
    })
  })

const resolveNativePath = path =>
  new Promise((resolve, reject) => {
    window.FilePath.resolveNativePath(path, resolve, err => {
      console.error(
        `${path} could not be resolved by the plugin: ${err.message}`
      )
      reject(err)
    })
  })

const getFiles = contentFiles =>
  Promise.all(
    contentFiles.map(async contentpath => {
      try {
        const dirEntry = await resolveNativePath(contentpath).then(getEntry)
        const file = await getFile(dirEntry)
        return file
      } catch (err) {
        try {
          console.warn(
            `Unable to get files with their real filename, let's try another way: ${
              err.message
            }`
          )
          const dirEntry = await getEntry(contentpath)
          const file = await getFile(dirEntry)
          return file
        } catch (err) {
          console.error(err)
          throw new Error(`Unable to get files: ${err.message}`)
        }
      }
    })
  )

const base64toBlob = (dataURI, type) => {
  const byteString = atob(dataURI)
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ab], { type })
}

const uploadFiles = (files, store) => {
  store.dispatch(
    addToUploadQueue(
      files,
      ROOT_DIR_ID,
      uploadedFile,
      (loaded, quotas, conflicts, errors) =>
        uploadQueueProcessed(loaded, quotas, conflicts, errors)
    )
  )
}

export const intentHandler = store => async ({
  action,
  extras = 'No extras in intent',
  ...args
}) => {
  if (extras['android.intent.extra.STREAM']) {
    const contentFiles = Array.isArray(extras['android.intent.extra.STREAM'])
      ? extras['android.intent.extra.STREAM']
      : [extras['android.intent.extra.STREAM']]
    try {
      const files = await getFiles(contentFiles)
      uploadFiles(files, store)
    } catch (err) {
      store.dispatch({
        type: 'INTENT_IMPORT_FAILED',
        alert: alertShow('intents.alert.error', null, 'info')
      })
    }
  }
}

const utiToMime = {
  'com.adobe.pdf': 'application/pdf',
  'com.adobe.postscript': 'application/postscript',
  'com.compuserve.gif': 'image/gif',
  'com.microsoft.bmp': 'image/bmp',
  'com.microsoft.word.doc': 'application/msword',
  'com.microsoft.excel.xls': 'application/vnd.ms-excel',
  'com.microsoft.powerpoint.ppt': 'application/mspowerpoint'
  // see https://developer.apple.com/library/content/documentation/Miscellaneous/Reference/UTIRef/Articles/System-DeclaredUniformTypeIdentifiers.html#//apple_ref/doc/uid/TP40009259-SW1
}

const getMimeTypeFromUTI = utis => {
  const knowUTIs = Object.keys(utiToMime)
  const firstKnownUTI = knowUTIs.find(uti => utis.indexOf(uti) >= 0)

  return firstKnownUTI ? utiToMime[firstKnownUTI] : ''
}

export const intentHandlerIOS = store => async intent => {
  const files = await Promise.all(
    intent.items.map(async item => {
      if (item.uti === 'public.image') {
        const blob = base64toBlob(item.data, item.type)
        blob.name = item.name
        return blob
      } else {
        const dirEntry = await getEntry(item.data)
        if (!dirEntry.type) dirEntry.type = getMimeTypeFromUTI(item.utis)
        const file = await getFile(dirEntry)

        return file
      }
    })
  )

  try {
    uploadFiles(files, store)
  } catch (err) {
    store.dispatch({
      type: 'INTENT_IMPORT_FAILED',
      alert: alertShow('intents.alert.errors', null, 'info')
    })
  }
}
