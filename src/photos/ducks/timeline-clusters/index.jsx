import React from 'react'
import { Query } from 'cozy-client'
import Timeline from '../timeline/components/Timeline'
import PhotoBoard from '../../components/PhotoBoard'
import {
  differenceInCalendarDays,
  differenceInCalendarMonths,
  differenceInHours
} from 'date-fns'
import { formatDMY, formatD, formatH } from './dates'
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

const TIMELINE_MUTATIONS = client => ({
  uploadPhoto: (file, dirPath) => {
    return client.upload(file, dirPath, {
      updateQueries: {
        [TIMELINE]: (previousData, result) => [result.data, ...previousData]
      }
    })
  },
  deletePhoto: photo =>
    client.destroy(photo, {
      updateQueries: {
        [TIMELINE]: (previousData, result) =>
          previousData.filter(p => p._id !== result.data.id)
      }
    })
})

/**
 *  Create the title for the section, following these rules:
 *  - If the period is within same month: D - D M Y
 *  - Else: D M Y - D M Y
 *  - Exception: don't show the year if it is the current one.
 */
const getSectionTitle = (album, f) => {
  if (album.period) {
    const startPeriod = new Date(album.period.start)
    const endPeriod = new Date(album.period.end)

    if (differenceInCalendarMonths(endPeriod, startPeriod) > 0) {
      return formatDMY(f, startPeriod) + ' - ' + formatDMY(f, endPeriod)
    }
    if (differenceInCalendarDays(endPeriod, startPeriod) > 0) {
      return formatD(f, startPeriod) + '-' + formatDMY(f, endPeriod)
    }
    return formatDMY(f, startPeriod)
  }
  return formatDMY(f, new Date(album.name))
}

/**
 * Add the hours to the section's title if other sections are the same day.
 * The rules are the following:
 *  - If the album's period is within the same hour:  HH
 *  - Else: HH-HH
 */
const getSectionTitleHours = (dates, index, section, f) => {
  if (section.album) {
    if (
      (index > 0 &&
        differenceInCalendarDays(dates[index - 1], dates[index]) < 1) ||
      (index < dates.length - 1 &&
        differenceInCalendarDays(dates[index], dates[index + 1]) < 1)
    ) {
      // Several sections for this day: add the hours
      const startPeriod = new Date(section.album.period.start)
      const endPeriod = new Date(section.album.period.end)
      console.log('title : ', section.title)
      console.log('start period : ', startPeriod)

      let titleWithHours = section.title + ' ⠂' + formatH(f, startPeriod) + 'h'
      if (differenceInHours(endPeriod, startPeriod) > 0) {
        titleWithHours += '-' + formatH(f, endPeriod) + 'h'
      }
      console.log('title hours : ', titleWithHours)
      return titleWithHours
    }
  }
  return section.title
}

/**
 * A section matches if:
 * - The datetime is inside the period.
 * - The section has no period (not a cluster) and is the datetime's day.
 */
const getMatchingSection = (sections, datetime) => {
  return Object.keys(sections).find(date => {
    if (sections[date].album) {
      const startPeriod = new Date(sections[date].album.period.start)
      const endPeriod = new Date(sections[date].album.period.end)
      return (
        (datetime >= startPeriod && datetime <= endPeriod) ||
        differenceInCalendarDays(datetime, endPeriod) === 0
      )
    } else {
      // If the section has no album, it is not a cluster but a daily section
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
    // A photo can be referenced by only one auto album
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
          album: album
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
      const date = new Date(datetime)
      const day = f(date, 'YYYY-MM-DD') // Match the albums's format
      sections[day] = {
        key: date,
        title: formatDMY(f, date),
        photos: [photo]
      }
    }
  })

  const sortedDates = Object.keys(sections)
  console.log('sections : ', Object.keys(sections).length)
  sortedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  return sortedDates.map((date, i) => {
    return {
      title: getSectionTitleHours(sortedDates, i, sections[date], f),
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
