/* global cozy */
import { getList, createFetchAction, createFetchIfNeededAction, insertAction, deleteAction } from '../lists'
import Toolbar from './components/Toolbar'
import DeleteConfirm from './components/DeleteConfirm'
import { hideSelectionBar } from '../selection'
import { FILE_DOCTYPE, FETCH_LIMIT, ALBUM_DOCTYPE } from '../../constants/config'

// constants
const TIMELINE = 'timeline'

// selectors
export const getTimelineList = state => getList(state, TIMELINE)

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
        if (ref.type === ALBUM_DOCTYPE) {
          await cozy.client.data.removeReferencedFiles({ _id: ref.id, _type: ref.type }, id)
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

const fetchPhotos = async (index, skip = 0) => {
  const options = {
    selector: {
      class: 'image',
      trashed: false
    },
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
