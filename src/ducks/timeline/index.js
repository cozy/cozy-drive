/* global cozy */
import { getList, createFetchAction, createFetchIfNeededAction, insertAction } from '../lists'
import {
  FILE_DOCTYPE,
  FETCH_LIMIT
} from '../../constants/config'

const TIMELINE = 'timeline'

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
  return await cozy.client.data.query(index, options)
    .then((response) => {
      const { docs, next } = response
      return { entries: docs, next, index, skip }
    })
}

export const fetchIfNeededPhotos = createFetchIfNeededAction(TIMELINE, (index, skip = 0) => {
  return index
    ? fetchPhotos(index, skip)
    : indexFilesByDate().then(index => fetchPhotos(index, skip))
})

export const fetchMorePhotos = createFetchAction(TIMELINE, fetchPhotos)

export const addPhotosToTimeline = photos => {
  return async dispatch => dispatch(insertAction(TIMELINE, photos))
}

export const getTimelineList = state => getList(state, TIMELINE)

import Toolbar from './components/Toolbar'

export { Toolbar }
