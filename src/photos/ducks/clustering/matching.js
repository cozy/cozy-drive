const outsideClusteringEdges = (photo, newestAlbum, oldestAlbum) => {
  const photoDate = new Date(photo.datetime)
  const newestEnd = new Date(newestAlbum.period.end)
  const oldestStart = new Date(oldestAlbum.period.start)

  if (photoDate > newestEnd) {
    return newestAlbum
  } else if (photoDate < oldestStart) {
    return oldestAlbum
  }
  return null
}

const photoInsideCluster = (photo, album) => {
  const photoDate = new Date(photo.datetime)
  const albumStart = new Date(album.period.start)
  const albumEnd = new Date(album.period.end)

  return photoDate <= albumEnd && photoDate >= albumStart
}

const photoBetweenClusters = (photo, newerAlbum, olderAlbum) => {
  const photoDate = new Date(photo.datetime)
  const newerStart = new Date(newerAlbum.period.start)
  // The olderAlbum might be null if this is the last element
  const olderEnd = olderAlbum ? new Date(olderAlbum.period.end) : null
  // Photo between clusters
  return olderEnd && photoDate < newerStart && photoDate > olderEnd
}

/**
 *  Find the existing clusters in which a photo temporally match for clustering.
 *  There are 3 cases for this to occur:
 *    - A photo's datetime is beyond the oldest or newest album.
 *    - A photo's datetime is inside an album period.
 *    - A photo's datetime is in a gap between an album and an adjacent one.

 *  Note that albums are sorted by date from newest to oldest.
 * @param {Object} photo - the photo to clusterize
 * @param {Object[]} albums - the existing clusters, seen as albums
 * @returns {Object[]} An array of matching clusters. length can be 0, 1 or 2.
 */
export const matchingClusters = (photo, albums) => {
  const newestAlbum = albums[0]
  const oldestAlbum = albums[albums.length - 1]
  const edge = outsideClusteringEdges(photo, newestAlbum, oldestAlbum)
  if (edge) {
    return [edge]
  }
  for (let i = 0; i < albums.length; i++) {
    if (photoInsideCluster(photo, albums[i])) {
      return [albums[i]]
    } else if (photoBetweenClusters(photo, albums[i], albums[i + 1])) {
      return [albums[i], albums[i + 1]]
    }
  }
  return []
}
