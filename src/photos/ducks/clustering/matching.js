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

const adjacentToClusters = (photo, newerAlbum, olderAlbum) => {
  const photoDate = new Date(photo.datetime)
  const newerStart = new Date(newerAlbum.period.start)
  const newerEnd = new Date(newerAlbum.period.end)
  // The olderAlbum might be null if this is the last element
  const olderEnd = olderAlbum ? new Date(olderAlbum.period.end) : null
  // Photo inside cluster
  if (photoDate <= newerEnd && photoDate >= newerStart) {
    return [newerAlbum]
  }
  // Photo between clusters
  if (olderEnd && photoDate < newerStart && photoDate > olderEnd) {
    return [newerAlbum, olderAlbum]
  }
  return []
}

/**
 *  Find the albums in which a photo can be added.
 *  Albums are sorted by date from newest to oldest.
 */
export const matchingClusters = (photo, albums) => {
  const newestAlbum = albums[0]
  const oldestAlbum = albums[albums.length - 1]
  const edge = outsideClusteringEdges(photo, newestAlbum, oldestAlbum)
  if (edge) {
    return [edge]
  }
  for (let i = 0; i < albums.length; i++) {
    const matches = adjacentToClusters(photo, albums[i], albums[i + 1])
    if (matches.length > 0) {
      return matches
    }
  }
  return []
}
