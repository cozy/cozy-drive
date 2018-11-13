import React from 'react'
import { Query } from 'cozy-client'
import Timeline from './components/Timeline'
import PhotoBoard from '../../components/PhotoBoard'

// constants
const TIMELINE = 'timeline'
const FILES_DOCTYPE = 'io.cozy.files'

const TIMELINE_QUERY = client =>
  client
    .find(FILES_DOCTYPE)
    .where({
      class: 'image',
      trashed: false
    })
    .select(['dir_id', 'name', 'size', 'updated_at', 'metadata'])
    .sortBy({
      'metadata.datetime': 'desc'
    })

const TIMELINE_MUTATIONS = query => ({
  uploadPhoto: (file, dirPath) => {
    return query.client.upload(file, dirPath)
  },
  deletePhoto: photo => query.client.destroy(photo)
})

const getPhotosByMonth = photos => {
  let sections = {}
  photos.forEach(p => {
    const datetime =
      p.metadata && p.metadata.datetime ? p.metadata.datetime : Date.now()
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
  const sortedMonths = Object.keys(sections)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .reverse()

  return sortedMonths.map(month => {
    return {
      month,
      photos: sections[month]
    }
  })
}
// eslint-disable-next-line
export default props => (
  <Query query={TIMELINE_QUERY} as={TIMELINE} mutations={TIMELINE_MUTATIONS}>
    {({ data, ...result }, mutations) => (
      <Timeline
        lists={data ? getPhotosByMonth(data) : []}
        data={data}
        {...mutations}
        {...result}
        {...props}
      />
    )}
  </Query>
)

export const TimelineBoard = ({ selection, ...props }) => (
  <Query query={TIMELINE_QUERY}>
    {({ data, ...result }) => (
      <PhotoBoard
        lists={data ? getPhotosByMonth(data) : []}
        photosContext="timeline"
        onPhotoToggle={selection.toggle}
        onPhotosSelect={selection.select}
        onPhotosUnselect={selection.unselect}
        {...result}
        {...props}
      />
    )}
  </Query>
)
