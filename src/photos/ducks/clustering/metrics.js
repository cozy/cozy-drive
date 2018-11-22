import { toRadians } from './maths'

/**
 *  Metric giving the spatial distance between 2 points
 */
export const spatial = (point1, point2) => {
  return geodesicDistance(point1, point2)
}

/**
 *  Metric giving the temporal distance between 2 points
 */
export const temporal = (point1, point2) => {
  return Math.abs(point1.date - point2.date)
}

/**
 *  Compute the geodesic distance between (point1, point2) coordinates
 *  See https://en.wikipedia.org/wiki/Geodesics_on_an_ellipsoid
 */
const geodesicDistance = (point1, point2) => {
  const lon1 = toRadians(point1.lon)
  const lat1 = toRadians(point1.lat)

  const lon2 = toRadians(point2.lon)
  const lat2 = toRadians(point2.lat)

  const diffLon = lon2 - lon1
  const diffLat = lat2 - lat1

  const aLat = Math.pow(Math.sin(diffLat / 2), 2)
  const aLon = Math.pow(Math.sin(diffLon / 2), 2)

  const a = aLat + Math.cos(lat1) * Math.cos(lat2) * aLon
  const c = 2 * Math.asin(Math.sqrt(a))

  // Radius of earth is 6371 km
  const distance = 6371 * c
  return distance
}
