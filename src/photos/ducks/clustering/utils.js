import { DOCTYPE_ALBUMS } from 'drive/lib/doctypes'
import { DAY_DURATION_IN_MS } from './consts'
import get from 'lodash/get'

/**
 * Returns the photos metadata sorted by date, from oldest to newest
 * @param {Object[]} photos - Set of photos
 * @returns {Object[]} The metadata's photos sorted by date
 */
export const prepareDataset = (photos, albums = []) => {
  const albumIds = albums.map(album => album._id)

  const info = photos
    .map(file => {
      const photo = {
        id: file._id || file.id,
        clusterId: file.clusterId,
        albums: file.albums
      }
      // Depending on the query, the attributes object might exists, or not
      const attributes = file.attributes ? file.attributes : file
      photo.name = attributes.name
      const metadata = attributes.metadata
      if (metadata) {
        photo.datetime = metadata.datetime
        photo.lat = metadata.gps ? metadata.gps.lat : null
        photo.lon = metadata.gps ? metadata.gps.long : null
      } else {
        photo.datetime = attributes.created_at
      }
      const hours = new Date(photo.datetime).getTime() / 1000 / 3600
      photo.timestamp = hours
      // For each photo, we need to check the clusterid, i.e. the auto-album
      // referenced by the file. If there is none, the photo wasn't clustered before
      if (!photo.clusterId && get(file, 'relationships.referenced_by.data')) {
        const ref = file.relationships.referenced_by.data.find(
          ref => ref.type === DOCTYPE_ALBUMS && albumIds.includes(ref.id)
        )
        if (ref) {
          photo.clusterId = ref.id
        }
      }
      return photo
    })
    .sort((pa, pb) => pa.timestamp - pb.timestamp)

  return info
}

/**
 * Compute the mean date based on the photos' timestamp
 * @param {Object[]} photos - Set of photos
 * @returns {Date} The average date
 */
export const averageTime = photos => {
  const sumHours = photos.reduce((acc, val) => acc + val.timestamp, 0)
  const averageHours = sumHours / photos.length
  return new Date(averageHours * 3600 * 1000).getTime()
}

/**
 *  Convert a duration into milliseconds.
 *  See https://golang.org/pkg/time/#ParseDuration for the duration format
 *  @param {string} duration - The duration in hms format
 *  @returns {number} The duration in milliseconds
 */
export const convertDurationInMilliseconds = duration => {
  const offsetH = duration.indexOf('h')
  const offsetM = duration.indexOf('m')
  const offsetS = duration.indexOf('s')

  const hours = offsetH > 0 ? duration.substring(0, offsetH) : 0
  const minutes = offsetM > 0 ? duration.substring(offsetH + 1, offsetM) : 0
  const seconds = offsetS > 0 ? duration.substring(offsetM + 1, offsetS) : 0
  return seconds * 1000 + minutes * 60 * 1000 + hours * 3600 * 1000
}

/**
 * Check if the duration between the 2 dates is more than 24h
 * @param {Date} date1 - The first date
 * @param {Date} date2 - The second date
 * @returns {bool} Whether or not the duration is more than 24h
 */
export const isDurationMoreThan24Hours = (date1, date2) => {
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()
  return Math.abs(d1 - d2) > DAY_DURATION_IN_MS
}
