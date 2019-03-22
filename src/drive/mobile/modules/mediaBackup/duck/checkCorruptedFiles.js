/* global cozy */
/* 
This file is TEMPORARY. It covers a stack bug and we need to synchronize again some files

!!TO BE DELETED WHEN datas are OK

*/
import { updateLibraryItem } from 'drive/mobile/lib/media'
import { CURRENT_UPLOAD_PROGRESS } from './reducer'
import throttle from 'lodash/throttle'
import localforage from 'localforage'

export const checkCorruptedFiles = async (photosOnDevice, dispatch) => {
  const onProgressUpdate = progress => {
    dispatch({ type: CURRENT_UPLOAD_PROGRESS, progress })
  }
  const onThumbnailGenerated = () => {}
  const seen = (await localforage.getItem('CORRUPTED_FILES')) || false
  if (seen === false) {
    const requestFiles = await cozy.client.fetchJSON('GET', '/files/fsck')
    await localforage.setItem('CORRUPTED_FILES', requestFiles)
  }
  const files = await localforage.getItem('CORRUPTED_FILES')
  try {
    files.reduce(async (memo, remoteFileCorrupted) => {
      if (remoteFileCorrupted.file_doc && remoteFileCorrupted.file_doc.name) {
        photosOnDevice.map(async photoOnDevice => {
          if (photoOnDevice.fileName === remoteFileCorrupted.file_doc.name) {
            try {
              await updateLibraryItem(
                remoteFileCorrupted.file_doc,
                photoOnDevice,
                throttle(onProgressUpdate, 500),
                onThumbnailGenerated
              )
              const newObj = files.reduce((acc, photo) => {
                if (photo.file_doc._id !== remoteFileCorrupted.file_doc._id) {
                  acc.push(remoteFileCorrupted)
                }
                return acc
              }, [])
              await localforage.setItem('CORRUPTED_FILES', newObj)
              return memo.push(photoOnDevice.id)
            } catch (error) {
              // eslint-disable-next-line no-console
              console.log('error on CORRUPTED FILES', error)
            }
          }
        })
      }
      return memo
    }, [])
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error globale', error)
  }
}
