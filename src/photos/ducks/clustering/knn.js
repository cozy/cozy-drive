import { kdTree } from 'kd-tree-javascript'
import { diffPairWise, standardDeviation, mean, quantile } from './maths'
import { MAX_DISTANCE } from './consts'

export default class KNN {
  /**
   * Compute K-Nearest-Neighbors on a dataset
   * @param {Array} dataset     - Array of points with k dimensions
   * @param {function} metric   - Metric to compute the distance
   * @param {Array} dimensions  - Dimensions to consider in the dataset
   */
  constructor(dataset, metric, dimensions) {
    this.points = dataset.slice()
    this.kdTree = new kdTree(this.points, metric, dimensions)
    this.maxNeighbors = 2
  }

  kNeighbors() {
    return this.points.map(point => {
      const nearestPoints = this.kdTree.nearest(point, this.maxNeighbors)
      if (nearestPoints.length > 0) {
        return { point: nearestPoints[0][0], distance: nearestPoints[0][1] }
      }
    })
  }

  excludeOutliers(distances, percentile) {
    const filtered = distances.filter(d => d < MAX_DISTANCE)
    const boundValue = quantile(filtered, percentile)
    return filtered.filter(distance => distance <= boundValue)
  }

  /**
  * Find  optimal epsilon with the first significative slope as proposed in [1]

  * [1] OZKOK, Fatma Ozge et CELIK, Mete. A New Approach to Determine Eps
  * Parameter of DBSCAN Algorithm. International Journal of Intelligent Systems
  * and Applications in Engineering, 2017, vol. 5, no 4, p. 247-251.
  */
  epsSignificativeSlope(distances) {
    if (distances.length < 3) {
      return null
    }

    const slopes = diffPairWise(distances)
    const slopesNotAroundZero = slopes.filter(diff => diff > 0.0001)

    if (slopesNotAroundZero.length > 0) {
      const avg = mean(slopesNotAroundZero)
      const std = standardDeviation(slopesNotAroundZero, avg)

      const indexSignSlope = slopes.findIndex(slope => {
        return slope >= avg + std
      })
      if (indexSignSlope > 0) {
        return distances[indexSignSlope]
      }
    }
    return null
  }
}
