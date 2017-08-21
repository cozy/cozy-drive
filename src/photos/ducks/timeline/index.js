/* global cozy */
import Toolbar from './components/Toolbar'
import DeleteConfirm from './components/DeleteConfirm'
import { hideSelectionBar, getSelectedIds } from '../selection'
import { FILE_DOCTYPE } from '../../constants/config'
import { DOCTYPE as ALBUMS_DOCTYPE, removeFromAlbum } from '../albums'
import { fetchCollection, makeActionCreator, createFile, trashFile } from '../../lib/redux-cozy-client'

// constants
const TIMELINE = 'timeline'
const FILES_DOCTYPE = 'io.cozy.files'

export const fetchTimeline = (skip = 0) => fetchCollection(TIMELINE, FILES_DOCTYPE, {
  fields: ['dir_id', 'name', 'size', 'updated_at', 'metadata'],
  selector: {
    class: 'image',
    trashed: false
  },
  sort: {
    'metadata.datetime': 'desc'
  }
})

export const uploadPhoto = (file, dirPath) => makeActionCreator(async (client) => {
  const dirID = await client.ensureDirectoryExists(dirPath)
  return createFile(file, dirID, { updateCollections: ['timeline'] })
})

// TODO: find a cleaner way
export const deletePhotos = ids => async dispatch => {
  for (const id of ids) {
    try {
      const rawFile = await cozy.client.data.find(FILE_DOCTYPE, id)
      const file = { ...rawFile, id: rawFile._id, type: rawFile._type }
      if (file.referenced_by) {
        for (const ref of file.referenced_by) {
          if (ref.type === ALBUMS_DOCTYPE) {
            await dispatch(removeFromAlbum(ref, [id]))
          }
        }
      }
      await dispatch(trashFile(file, { updateCollections: ['timeline'] }))
    } catch (e) {
      console.log(e)
    }
    dispatch(hideSelectionBar())
  }
}

// selectors
export const isRelated = (state, photos) => {
  if (!photos) {
    return false
  }
  const ids = getSelectedIds(state)
  for (const id of ids) {
    for (const photo of photos) {
      if (photo.id === id && photo.relationships && photo.relationships.referenced_by && photo.relationships.referenced_by.data && photo.relationships.referenced_by.data.length > 0) {
        const refs = photo.relationships.referenced_by.data
        for (const ref of refs) {
          if (ref.type === ALBUMS_DOCTYPE) {
            return true
          }
        }
      }
    }
  }
  return false
}

// components
export { Toolbar }
export { DeleteConfirm }

export const getPhotosByMonth = (photos, f, format) => {
  let sections = {}
  photos.forEach(p => {
    const datetime = p.metadata && p.metadata.datetime ? p.metadata.datetime : Date.now()
    // here we want to get an object whose keys are months in a l10able format
    // so we only keep the year and month part of the date
    const month = datetime.slice(0, 7) + '-01T00:00'
    /* istanbul ignore else */
    if (!sections.hasOwnProperty(month)) {
      sections[month] = []
    }
    sections[month].push(p)
  })
  // we need to sort the months here because when new photos are uploaded, they
  // are inserted on top of the list, and months can become unordered
  const sortedMonths = Object.keys(sections).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  ).reverse()

  return sortedMonths.map(month => {
    return {
      title: f(month, format),
      photos: sections[month]
    }
  })
}
