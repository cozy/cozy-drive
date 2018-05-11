import { getEntry } from './filesystem'
import { alertShow } from '../../ducks/alerter/index'
import { addToUploadQueue } from '../../ducks/upload/index'
import { ROOT_DIR_ID } from '../../constants/config'
import { uploadedFile } from '../../actions/index'

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

const uploadFiles = (files, store) => {
  store.dispatch(
    addToUploadQueue(
      files,
      ROOT_DIR_ID,
      uploadedFile,
      (loaded, quotas, conflicts, errors) => {
        let action = { type: '' } // dummy action, we only use it to trigger an alert notification
        if (conflicts.length > 0) {
          action.alert = alertShow(
            'upload.alert.success_conflicts',
            {
              smart_count: loaded.length,
              conflictNumber: conflicts.length
            },
            'info'
          )
        } else if (errors.length > 0) {
          action.alert = alertShow('upload.alert.errors', null, 'error')
        } else {
          action.alert = alertShow(
            'upload.alert.success',
            { smart_count: loaded.length },
            'success'
          )
        }

        return action
      }
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
