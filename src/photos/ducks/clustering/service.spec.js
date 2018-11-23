import {
  computeEpsTemporal,
  computeEpsSpatial,
  reachabilities
} from './service'
import { quantile, mean, standardDeviation } from './maths'
import { temporal, spatial, spatioTemporalScaled } from './metrics'

const N_DIGITS = 4
const dataset = [
  {
    date: 10,
    lat: 41.1,
    lon: 0.2
  },
  {
    date: 12,
    lat: 41.2,
    lon: 0.2
  },
  {
    date: 15,
    lat: 44.5,
    lon: 2.2
  },
  {
    date: 60,
    lat: 41.1,
    lon: 3.2
  },
  {
    date: 80,
    lat: 40.5,
    lon: 3.0
  },
  {
    date: 110,
    lat: 20,
    lon: 20
  }
]

const maxBound = 500

describe('maths', () => {
  let random_data = [
    -1.56963766,
    0.77667398,
    1.1107855,
    -0.12783372,
    -0.83557117,
    -0.48297551,
    -1.89519756,
    1.55576088,
    -0.82488814,
    -0.23281369,
    -0.54799257,
    0.05951311,
    0.58379171,
    -0.69129147,
    0.04765197
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
    expect(computeEpsSpatial(dataset)).toBeCloseTo(386.7568, N_DIGITS)
  })
})

describe('clustering', () => {
  it('Should cluster data with temporal metric', () => {
    const expectedReach = [null, 2, 3, 45, 20, 30]

    const reachs = reachabilities(dataset, temporal, { maxBound: maxBound })
    expect(reachs).toEqual(expect.arrayContaining(expectedReach))
  })

  it('Should cluster data with spatial metric', () => {
    const expectedReach = [
      11.119492664456596,
      401.5003434905605,
      386.7568104542309,
      68.80809741870237
    ]

    const reachs = reachabilities(dataset, spatial, { maxBound: maxBound })
    expect(reachs).toEqual(expect.arrayContaining(expectedReach))
  })

  it('Should cluster data with spatio temporal scaled metric', () => {
    const expectedReach = [
      null,
      6.559746332228298,
      202.25017174528026,
      215.87840522711545,
      44.40404870935119,
      null
    ]

    const params = {
      epsTemporal: maxBound / 2,
      epsSpatial: maxBound / 2,
      maxBound: maxBound
    }
    const reachs = reachabilities(dataset, spatioTemporalScaled, params)
    expect(reachs).toEqual(expect.arrayContaining(expectedReach))
  })
})
