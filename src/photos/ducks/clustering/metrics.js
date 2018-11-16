import { toRadians } from './maths'

/**
 *  Metric giving the spatial distance between 2 points
 */
export const spatial = (p1, p2) => {
  return geodesicDistance(p1, p2)
}

/**
 *  Metric giving the temporal distance between 2 points
 */
export const temporal = (p1, p2) => {
  return Math.abs(p1.date - p2.date)
}

/**
 *  Compute the geodesic distance between (x1, x2) coordinates
 *  See https://en.wikipedia.org/wiki/Geodesics_on_an_ellipsoid
 */
const geodesicDistance = (x1, x2) => {
  const lon1 = toRadians(x1.lon)
  const lat1 = toRadians(x1.lat)

  const lon2 = toRadians(x2.lon)
  const lat2 = toRadians(x2.lat)

  const dlon = lon2 - lon1
  const dlat = lat2 - lat1

  const a1 = Math.pow(Math.sin(dlat / 2), 2)
  const a2 = Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2)
  const a = a1 + a2
  const c = 2 * Math.asin(Math.sqrt(a))

  // Radius of earth is 6371 km
  const dist = 6371 * c
  return dist
}
