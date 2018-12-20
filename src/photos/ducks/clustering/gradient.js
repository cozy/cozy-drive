const distanceVectors = (xReach, yReach) => {
  return Math.sqrt(1 + Math.pow(yReach - xReach, 2))
}

const inflectionIndex = (xReach, yReach, zReach) => {
  const vectorXY = distanceVectors(xReach, yReach)
  const vectorYZ = distanceVectors(yReach, zReach)

  return (-1 + (xReach - yReach) * (zReach - yReach)) / (vectorXY * vectorYZ)
}

const gradientDeterminant = (xReach, yReach, zReach) => {
  return yReach - xReach - (zReach - yReach)
}

const hasInflection = (xReach, yReach, zReach, cosAngle) => {
  return inflectionIndex(xReach, yReach, zReach) > cosAngle
}

/**
 * Deals with the special case where (x,y,z)  are on an increasing slope
 * based on their reachabilities. The angle between (x, y) and (y, z) is thus
 * flat and no cluster boundary is detected.
 */
const increasingSlope = (xReach, yReach, zReach, cosAngle) => {
  // End of the reachabilities
  if (zReach === undefined) {
    return false
  }

  if (xReach < yReach && yReach < zReach) {
    // Build a fake point, symmetric of zReach w.r.t. y axe = yReach
    const fakeZReach = yReach + (yReach - zReach)
    // Check if the (xReach, yReach) . (yReach, fakeZReach) angle would have
    // triggered an inflection point
    return hasInflection(xReach, yReach, fakeZReach, cosAngle)
  }
  return false
}

/**
 * Deals with the special case where (x, y, z)  are on a decreasing slope
 * based on their reachabilities. The angle between (x, y) and (y, z) is thus
 * flat and no cluster boundary is detected.
 *
 */
const decreasingSlope = (xReach, yReach, zReach, cosAngle) => {
  // End of the reachabilities
  if (zReach === undefined) {
    return false
  }

  if (xReach > yReach && yReach > zReach) {
    // Build a fake point symmetric of xReach w.r.t. y axe = yReach
    const fakeXReach = yReach + (yReach - xReach)
    // Check if the (fakeXReach, yReach) . (yReach, zReach) angle would have
    // triggered an inflection point
    return hasInflection(fakeXReach, yReach, zReach, cosAngle)
  }
  return false
}

/**
 * Create clusters based on the dataset's reachabilites.
 * Loosely inspired by the gradient method defined by [1].
 * It mainly consists of finding inflections between points reachabilites and
 * extract cluster if it is higher than a fixed angle.
 *
 * [1] Brecheisen, S., Kriegel, H.P., Kroger, P. and Pfeifle, M., 2004, April.
 * Visually Mining through Cluster Hierarchies. I
 * In SDM (pp. 400-411).
 *
 */
export const gradientClustering = (dataset, reachabilities, params) => {
  // TODO lonely point

  const clusters = []
  let currentCluster = [dataset[0]]
  if (dataset.length < 2) {
    return [currentCluster]
  }

  for (let i = 1; i < reachabilities.length - 1; i++) {
    const prevReach = reachabilities[i - 1]
    const currReach = reachabilities[i]
    const nextReach = reachabilities[i + 1]

    // Noise detection: if the current point is higher than the maxBound, save
    // the current cluster and start a new one
    if (currReach > params.maxBound) {
      if (currentCluster.length > 0) {
        clusters.push(currentCluster)
      }
      currentCluster = [dataset[i]]

      // The next point is also a noise: the current point is a single cluster
      if (nextReach > params.maxBound) {
        clusters.push(currentCluster)
        currentCluster = []
      }
    } else {
      // Special cases: if one of them is true, start a new cluster
      if (currentCluster.length > 0) {
        const slopeIsIncreasing = increasingSlope(
          prevReach,
          currReach,
          nextReach,
          params.cosAngle
        )
        const slopeIsDecreasing = decreasingSlope(
          currReach,
          nextReach,
          params.cosAngle
        )

        if (slopeIsIncreasing || slopeIsDecreasing) {
          clusters.push(currentCluster)
          currentCluster = []
        }
      }

      // The current point is an inflection point
      if (hasInflection(prevReach, currReach, nextReach, params.cosAngle)) {
        // The next vector deviates to the left, marking an endpoint
        if (gradientDeterminant(prevReach, currReach, nextReach) < 0) {
          currentCluster.push(dataset[i])
          const diff = nextReach - currReach
          // If the reachability of the next point is higher, it is a new cluster
          if (diff > 0) {
            clusters.push(currentCluster)
            currentCluster = []
          }
        } else {
          // The next vector deviates to the right
          if (currentCluster.length > 0) {
            clusters.push(currentCluster)
          }
          currentCluster = [dataset[i]]
        }
      } else {
        // The current point is not an inflection: just add it to the current cluster
        currentCluster.push(dataset[i])
      }
    }
  }

  const lastPoint = reachabilities[reachabilities.length - 1]
  // The last point is not noise: add it to the current cluster if not empty
  if (currentCluster.length > 0 && lastPoint < params.maxBound) {
    currentCluster.push(dataset[dataset.length - 1])
    clusters.push(currentCluster)
  } else {
    // The last point is a single cluster
    if (currentCluster.length > 0) {
      clusters.push(currentCluster)
    }
    clusters.push([dataset[dataset.length - 1]])
  }
  return clusters
}

/**
 * Compute the gradient angle based on the eps and a multiplicator coefficient
 * The higher is the coef, the more coarse is the clustering.
 */
export const gradientAngle = (eps, coefficient) => {
  if (coefficient === undefined) {
    coefficient = 1
  }
  return Math.cos(2 * Math.atan(1 / eps)) / coefficient
}
