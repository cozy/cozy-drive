import React from 'react'
import { Query } from 'cozy-client'
import Timeline from '../timeline/components/Timeline'
import PhotoBoard from '../../components/PhotoBoard'
import { differenceInCalendarDays } from 'date-fns'
import { translate } from 'cozy-ui/react/I18n'

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
    .include(['albums'])

const TIMELINE_MUTATIONS = query => ({
  uploadPhoto: (file, dirPath) => {
    return query.client.upload(file, dirPath, {
      updateQueries: {
        [TIMELINE]: (previousData, result) => [result.data, ...previousData]
      }
    })
  },
  deletePhoto: photo =>
    query.client.destroy(photo, {
      updateQueries: {
        [TIMELINE]: (previousData, result) =>
          previousData.filter(p => p._id !== result.data.id)
      }
    })
})

const formatDate = (date, f) => {
  return f(date, 'DD MMMM YYYY')
}

const getSectionTitle = (album, f) => {
  if (album.period) {
    const startPeriod = new Date(album.period.start)
    const endPeriod = new Date(album.period.end)
    if (differenceInCalendarDays(endPeriod, startPeriod) > 0) {
      // TODO Better period display
      return formatDate(startPeriod, f) + ' - ' + formatDate(endPeriod, f)
    }
  }
  return formatDate(new Date(album.name), f)
}

/**
 * A section matches if:
 * - The datetime is inside the period.
 * - The section has no period (not a cluster) and is the datetime's day.
 */
const getMatchingSection = (sections, datetime) => {
  return Object.keys(sections).find(date => {
    if (sections[date].period) {
      const startPeriod = new Date(sections[date].period.start)
      const endPeriod = new Date(sections[date].period.end)
      return datetime >= startPeriod && datetime <= endPeriod
    } else {
      // If the section has no period, it is not a cluster but a daily section
      return differenceInCalendarDays(datetime, new Date(date)) === 0
    }
  })
}

/**
 * Retrieve photos by clusters. Each clusterized photo is referenced by an album
 * having an 'auto' field to true.
 * If a photo is not clusterized yet (newly updated ones), we try to insert them
 * inside existing clusters, or group them per day otherwise.
 */
const getPhotosByClusters = (photos, f) => {
  const sections = {}
  const photosNotClustered = []

  photos.forEach(p => {
    const refAlbums = p.albums ? p.albums.data : []
    // TODO Ensure unicity on the service side
    const album = refAlbums.find(ref => ref.auto)

    // The photo is not referenced by an auto album yet
    if (!album) {
      photosNotClustered.push(p)
    } else {
      const date = album.name

      if (!sections.hasOwnProperty(date)) {
        const title = getSectionTitle(album, f)
        sections[date] = {
          photos: [],
          title: title,
          period: album.period
        }
      }
      sections[date].photos.push(p)
    }
  })

  // We deal with the not-clustered photos after the loop to make sure all
  // the sections have been processed.
  // It simulates a clustering, waiting for the actual one to be processed.
  photosNotClustered.forEach(photo => {
    const datetime =
      photo.metadata && photo.metadata.datetime
        ? photo.metadata.datetime
        : photo.created_at

    const sectionDate = getMatchingSection(sections, new Date(datetime))
    if (sectionDate) {
      sections[sectionDate].photos.push(photo)
    } else {
      // Create a new section for this day, without a period, to differentiate from clusters' sections
      const day = f(new Date(datetime), 'YYYY-MM-DD')
      sections[day] = {
        title: formatDate(new Date(datetime), f),
        photos: [photo]
      }
    }
  })

  const sorted = Object.keys(sections)
  sorted.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return sorted.map(date => {
    return {
      title: sections[date].title,
      photos: sections[date].photos
    }
  })
}

// eslint-disable-next-line
export default translate()(props => (
  <Query query={TIMELINE_QUERY} as={TIMELINE} mutations={TIMELINE_MUTATIONS}>
    {({ data, ...result }, mutations) => (
      <Timeline
        lists={data ? getPhotosByClusters(data, props.f) : []}
        data={data}
        {...mutations}
        {...result}
        {...props}
      />
    )}
  </Query>
))

export const TimelineBoard = ({ selection, ...props }) => (
  <Query query={TIMELINE_QUERY}>
    {({ data, ...result }) => (
      <PhotoBoard
        lists={data ? getPhotosByClusters(data, props.f) : []}
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

translate()(TimelineBoard)
