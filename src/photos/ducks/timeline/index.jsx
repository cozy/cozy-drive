import React from 'react'
import { Query } from 'cozy-client'
import Timeline from './components/Timeline'
import { translate } from 'cozy-ui/react/I18n'
import {
  formatDMY,
  formatD,
  formatH,
  formatYMD,
  isSameDay,
  isSameMonth,
  isSameHour,
  isEqualOrOlder,
  isEqualOrNewer
} from './dates'
import { format } from 'date-fns'
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

const TIMELINE_MUTATIONS = client => ({
  uploadPhoto: async (file, dirId) => {
    return client.mutate({
      mutationType: 'UPLOAD_PHOTO',
      execute: () =>
        client.collection('io.cozy.files').createFile(file, { dirId })
    })
  },
  deletePhoto: photo => client.destroy(photo)
})

/**
 *  Create the title for the section, following these rules:
 *  - If the period is within same month: D - D M Y
 *  - Else: D M Y - D M Y
 *  - Exception: don't show the year if it is the current one.
 */
const getSectionTitle = (album, f) => {
  if (album.period) {
    const startPeriod = album.period.start
    const endPeriod = album.period.end

    if (!isSameMonth(f, endPeriod, startPeriod)) {
      return formatDMY(f, startPeriod) + ' - ' + formatDMY(f, endPeriod)
    }
    if (!isSameDay(f, endPeriod, startPeriod)) {
      return formatD(f, startPeriod) + '-' + formatDMY(f, endPeriod)
    }
    return formatDMY(f, startPeriod)
  }
  return formatDMY(f, album.name)
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
      (index > 0 && isSameDay(f, dates[index - 1], dates[index])) ||
      (index < dates.length - 1 && isSameDay(f, dates[index], dates[index + 1]))
    ) {
      // Several sections for this day: add the hours
      const startPeriod = section.album.period.start
      const endPeriod = section.album.period.end

      let titleWithHours = section.title + ' · ' + formatH(f, startPeriod) + 'h'
      if (!isSameHour(f, endPeriod, startPeriod)) {
        titleWithHours += '-' + formatH(f, endPeriod) + 'h'
      }
      return titleWithHours
    }
  }
  return section.title
}

/**
 * A section matches if a not-clustered photo's datetime:
 * - Is inside its period, or the same day
 */
const getMatchingSection = (sections, datetime, f) => {
  return Object.keys(sections).find(date => {
    if (sections[date].album) {
      const startPeriod = sections[date].album.period.start
      const endPeriod = sections[date].album.period.end
      const isInsidePeriod =
        isEqualOrNewer(datetime, startPeriod) &&
        isEqualOrOlder(datetime, endPeriod)
      return isInsidePeriod || isSameDay(f, datetime, endPeriod)
    } else {
      // If the section has no album, it is not a cluster but a daily section
      return isSameDay(f, datetime, date)
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

    const sectionDate = getMatchingSection(sections, datetime, f)
    if (sectionDate) {
      sections[sectionDate].photos.push(photo)
    } else {
      // Create a new section for this day, without a period, to differentiate from clusters' sections
      const day = formatYMD(f, datetime) // Match the albums's format
      sections[day] = {
        title: formatDMY(f, datetime),
        photos: [photo]
      }
    }
  })

  const sortedDates = Object.keys(sections)
  sortedDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  return sortedDates.map((date, i) => {
    return {
      title: getSectionTitleHours(sortedDates, i, sections[date], f),
      photos: sections[date].photos
    }
  })
}

export class TimelineBoard extends React.Component {
  render() {
    return (
      <Query
        query={TIMELINE_QUERY}
        as={TIMELINE}
        mutations={TIMELINE_MUTATIONS}
      >
        {({ data, ...result }, mutations) => (
          <Timeline
            lists={data ? getPhotosByClusters(data, format) : []}
            data={data}
            {...mutations}
            {...result}
            {...this.props}
          />
        )}
      </Query>
    )
  }
}

export default translate()(TimelineBoard)
