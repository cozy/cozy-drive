import KNN from './knn'
import { temporal, spatial } from './metrics'

export const computeEpsTemporal = (dataset, percentile) => {
  return computeEps(dataset, temporal, ['date'], percentile)
}

export const computeEpsSpatial = (dataset, percentile) => {
  return computeEps(dataset, spatial, ['lat', 'lon'], percentile)
}

/**
 *  Compute the eps parameter for the given dataset, based on the idea described
 *  in [1]. Basically it consists of computing the k-nearest-neighbors (knn) for
 *  each point, and finding the optimal point on the sorted data, i.e. the first
 *  one making a significative slope.
 *
 *  [1] Ester, M., Kriegel, H. P., Sander, J., & Xu, X. (1996, August).
 *  A density-based algorithm for discovering clusters in large spatial databases with noise.
 *  In Kdd (Vol. 96, No. 34, pp. 226-231).
 */
const computeEps = (dataset, metric, dimensions, percentile) => {
  // Compute the k-nearest neighbors on the data
  const knn = new KNN(dataset, metric, dimensions)
  const neighbors = knn.kNeighbors(dataset)

  // Extract the sorted distances and remove outliers
  const distances = neighbors.map(n => n.distance).sort((a, b) => a - b)
  knn.excludeOutliers(distances, percentile)

  // Compute the optimal eps for the given criterion
  return knn.epsSignificativeSlope(distances)
}
