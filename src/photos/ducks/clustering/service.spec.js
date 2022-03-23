import {
  computeEpsTemporal,
  computeEpsSpatial,
  reachabilities
} from './service'
import { quantile, mean, standardDeviation } from './maths'
import { temporal, spatial, spatioTemporalScaled } from './metrics'
import { gradientClustering, gradientAngle } from './gradient'

const N_DIGITS = 4
const dataset = [
  {
    timestamp: 10,
    lat: 41.1,
    lon: 0.2
  },
  {
    timestamp: 12,
    lat: 41.2,
    lon: 0.2
  },
  {
    timestamp: 15,
    lat: 44.5,
    lon: 2.2
  },
  {
    timestamp: 60,
    lat: 44.5,
    lon: 2.0
  },
  {
    timestamp: 80,
    lat: 40.5,
    lon: 3.0
  },
  {
    timestamp: 110,
    lat: 20,
    lon: 20
  }
]

const maxBound = 500

describe('maths', () => {
  let random_data = [
    -1.56963766, 0.77667398, 1.1107855, -0.12783372, -0.83557117, -0.48297551,
    -1.89519756, 1.55576088, -0.82488814, -0.23281369, -0.54799257, 0.05951311,
    0.58379171, -0.69129147, 0.04765197
  ]
  it('Should compute the right mean', () => {
    expect(mean(random_data)).toBeCloseTo(-0.2049, N_DIGITS)
  })
  it('Should compute the right standard deviation', () => {
    expect(standardDeviation(random_data)).toBeCloseTo(0.9125, N_DIGITS)
  })
  it('Should compute the right quantiles', () => {
    expect(quantile(random_data, 5)).toBeCloseTo(-1.6673, N_DIGITS)
    expect(quantile(random_data, 25)).toBeCloseTo(-0.7581, N_DIGITS)
    expect(quantile(random_data, 42)).toBeCloseTo(-0.4908, N_DIGITS)
    expect(quantile(random_data, 50)).toBeCloseTo(-0.2328, N_DIGITS)
  })
})

describe('knn', () => {
  it('Should compute temporal eps', () => {
    expect(computeEpsTemporal(dataset)).toBeCloseTo(3.0, N_DIGITS)
  })
  it('Should compute spatial eps', () => {
    expect(computeEpsSpatial(dataset)).toBeCloseTo(11.11949, N_DIGITS)
  })
})

describe('clustering', () => {
  it('Should cluster data with temporal metric', () => {
    const expectedReach = [Number.MAX_VALUE, 2, 3, 45, 20, 30]
    const expectedClusters = [
      [dataset[0], dataset[1], dataset[2]],
      [dataset[3], dataset[4]],
      [dataset[5]]
    ]
    const cosAngle = gradientAngle(15, 1)
    const params = { maxBound, cosAngle }
    const reachs = reachabilities(dataset, temporal, params)
    expect(reachs).toEqual(expect.arrayContaining(expectedReach))
    const clusters = gradientClustering(dataset, reachs, params)
    expect(clusters).toEqual(expect.arrayContaining(expectedClusters))
  })

  it('Should cluster data with spatial metric', () => {
    const expectedReach = [
      Number.MAX_VALUE,
      11.119492664456596,
      401.5003434905605,
      15.86196231832396,
      452.26128149210217,
      2792.7786730017874
    ]
    const expectedClusters = [
      [dataset[0], dataset[1]],
      [dataset[2], dataset[3]],
      [dataset[4]],
      [dataset[5]]
    ]

    const cosAngle = gradientAngle(15, 1)
    const params = { maxBound, cosAngle }
    const reachs = reachabilities(dataset, spatial, params)
    expect(reachs).toEqual(expect.arrayContaining(expectedReach))
    const clusters = gradientClustering(dataset, reachs, params)
    expect(clusters).toEqual(expect.arrayContaining(expectedClusters))
  })

  it('Should cluster data with spatio temporal scaled metric', () => {
    const expectedReach = [
      Number.MAX_VALUE,
      6.559746332228298,
      202.25017174528026,
      30.43098115916198,
      236.13064074605109,
      1411.3893365008937
    ]
    const expectedClusters = [
      [dataset[0], dataset[1]],
      [dataset[2], dataset[3]],
      [dataset[4]],
      [dataset[5]]
    ]

    const params = {
      epsTemporal: maxBound / 2,
      epsSpatial: maxBound / 2,
      maxBound: maxBound,
      cosAngle: gradientAngle(15, 1)
    }
    const reachs = reachabilities(dataset, spatioTemporalScaled, params)
    expect(reachs).toEqual(expect.arrayContaining(expectedReach))
    const clusters = gradientClustering(dataset, reachs, params)
    expect(clusters).toEqual(expect.arrayContaining(expectedClusters))
  })

  it('Should cluster real data with spatio temporal scaled metric', () => {
    const realDataset = [
      {
        timestamp:
          new Date('2018-08-08T18:43:09+02:00').getTime() / 1000 / 3600,
        lat: 44.849386305555555,
        lon: -0.5606861944444445
      },
      {
        timestamp:
          new Date('2018-08-08T18:43:19+02:00').getTime() / 1000 / 3600,
        lat: 44.849365694444444,
        lon: -0.5606654166666667
      },
      {
        timestamp:
          new Date('2018-08-08T18:48:26+02:00').getTime() / 1000 / 3600,
        lat: 44.84903605555556,
        lon: -0.55948175
      },
      {
        timestamp:
          new Date('2018-08-08T19:38:51+02:00').getTime() / 1000 / 3600,
        lat: 44.849544388888894,
        lon: -0.5605915
      },
      {
        timestamp:
          new Date('2018-08-08T22:15:32+02:00').getTime() / 1000 / 3600,
        lat: 44.84038105555556,
        lon: -0.56100925
      },
      {
        timestamp:
          new Date('2018-08-09T05:05:08+02:00').getTime() / 1000 / 3600,
        lat: 44.83123536111111,
        lon: -0.5740531388888889
      }
    ]
    const params = {
      epsTemporal: 3,
      epsSpatial: 2.5,
      maxBound: 6,
      cosAngle: gradientAngle(3, 1)
    }

    const expectedClusters = [
      [
        realDataset[0],
        realDataset[1],
        realDataset[2],
        realDataset[3],
        realDataset[4]
      ],
      [realDataset[5]]
    ]

    const reachs = reachabilities(realDataset, spatioTemporalScaled, params)
    const clusters = gradientClustering(realDataset, reachs, params)
    expect(clusters).toEqual(expect.arrayContaining(expectedClusters))
  })
})
