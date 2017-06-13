/* global cozy */
import { getList, createFetchAction, createFetchIfNeededAction, insertAction, deleteAction } from '../lists'
import Toolbar from './components/Toolbar'
import DeleteConfirm from './components/DeleteConfirm'
import { hideSelectionBar } from '../selection'
import { FILE_DOCTYPE, FETCH_LIMIT } from '../../constants/config'

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
    fields: ['_id', 'dir_id', 'name', 'size', 'updated_at', 'metadata'],
    descending: true,
    limit: FETCH_LIMIT,
    skip,
    wholeResponse: true
  }
  const { docs, next } = await cozy.client.data.query(index, options)
  let entries = []
  for (let doc of docs) {
    // we need to do this so that photos have their links property
    entries.push(Object.assign(doc, await cozy.client.files.statById(doc._id)))
  }
  return { entries, next, index, skip }
}

export const fetchIfNeededPhotos = createFetchIfNeededAction(TIMELINE, (index, skip = 0) => {
  return index
    ? fetchPhotos(index, skip)
    : indexFilesByDate().then(index => fetchPhotos(index, skip))
})

export const fetchMorePhotos = createFetchAction(TIMELINE, fetchPhotos)
