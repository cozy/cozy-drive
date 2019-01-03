/**
 * Returns the photos metadata sorted by date
 * @param {Object[]} photos - Set of photos
 * @returns {Object[]} The metadata's photos sorted by date
 */
export const prepareDataset = photos => {
  const info = photos
    .map(file => {
      const photo = {
        id: file._id || file.id,
        name: file.name,
        clusterId: file.clusterId
      }
      if (file.metadata) {
        photo.datetime = file.metadata.datetime
        photo.lat = file.metadata.gps ? file.metadata.gps.lat : null
        photo.lon = file.metadata.gps ? file.metadata.gps.long : null
      } else {
        photo.datetime = file.created_at
      }
      const hours = new Date(photo.datetime).getTime() / 1000 / 3600
      photo.timestamp = hours
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
