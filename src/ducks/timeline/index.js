/* global cozy */
import { getList, createFetchAction, createFetchIfNeededAction, createUpdateAction, insertAction, deleteAction } from '../lists'
import Toolbar from './components/Toolbar'
import DeleteConfirm from './components/DeleteConfirm'
import { hideSelectionBar, getSelectedIds } from '../selection'
import { FILE_DOCTYPE, FETCH_LIMIT } from '../../constants/config'
import { DOCTYPE as ALBUMS_DOCTYPE, removeFromAlbum } from '../albums'

// constants
const TIMELINE = 'timeline'
const DEFAULT_COUCH_SELECTOR = {
  class: 'image',
  trashed: false
}

// selectors
export const getTimelineList = state => getList(state, TIMELINE)
export const isRelated = state => {
  const ids = getSelectedIds(state)
  const list = getTimelineList(state)
  if (list) {
    for (const id of ids) {
      for (const photo of list.entries) {
        if (photo._id === id && photo.relationships && photo.relationships.referenced_by && photo.relationships.referenced_by.data && photo.relationships.referenced_by.data.length > 0) {
          const refs = photo.relationships.referenced_by.data
          for (const ref of refs) {
            if (ref.type === ALBUMS_DOCTYPE) {
              return true
            }
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

// async actions
export const addPhotosToTimeline = photos => async dispatch => {
  dispatch(insertAction(TIMELINE, { entries: photos }))
}

export const deletePhotos = ids => async dispatch => {
  for (const id of ids) {
    try {
      await cozy.client.files.trashById(id)
      dispatch(deleteAction(TIMELINE, id))
      const file = await cozy.client.data.find(FILE_DOCTYPE, id)

      for (const ref of file.referenced_by) {
        if (ref.type === ALBUMS_DOCTYPE) {
          dispatch(removeFromAlbum(ref, [id]))
        }
      }
    } catch (e) {
      console.log(e)
    }
    dispatch(hideSelectionBar())
  }
}

// list
const indexFilesByDate = async () => {
  const fields = [ 'class', 'trashed', 'metadata.datetime' ]
  return await cozy.client.data.defineIndex(FILE_DOCTYPE, fields)
}

const fetchPhotos = async (index, skip = 0, selector = DEFAULT_COUCH_SELECTOR) => {
  const options = {
    selector,
    // TODO: type and class should not be necessary, it's just a temp fix for a stack bug
    fields: ['_id', 'dir_id', 'name', 'size', 'updated_at', 'metadata', 'type', 'class'],
    descending: true,
    limit: FETCH_LIMIT,
    skip,
    wholeResponse: true
  }
  const { data, meta } = await cozy.client.files.query(index, options)
  return {
    entries: data.map(p => Object.assign({ _id: p.id }, p, p.attributes)),
    next: meta.count > skip + FETCH_LIMIT,
    index,
    skip
  }
}

export const fetchIfNeededPhotos = createFetchIfNeededAction(TIMELINE, (index, skip = 0) => {
  return index
    ? fetchPhotos(index, skip)
    : indexFilesByDate().then(index => fetchPhotos(index, skip))
})

export const fetchMorePhotos = createFetchAction(TIMELINE, fetchPhotos)

/**
* Updates a collection of photos based on their id
*/
export const refetchSomePhotos = createUpdateAction(TIMELINE, async (photos) => {
  const index = await indexFilesByDate()
  const selector = {
    ...DEFAULT_COUCH_SELECTOR,
    '_id': {
      '$in': photos
    }
  }
  return await fetchPhotos(index, 0, selector)
})

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
