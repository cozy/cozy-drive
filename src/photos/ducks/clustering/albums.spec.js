import { cozyClient } from 'cozy-konnector-libs'
import { gradientClustering, gradientAngle } from './gradient'
import { saveClustering } from './albums'
import { reachabilities } from './service'
import { spatioTemporalScaled } from './metrics'
import { DOCTYPE_ALBUMS } from '../../../drive/lib/doctypes'

describe('albums', () => {
  it('Should create auto albums after clustering', () => {
    const dataset = [
      {
        id: 'photo1',
        name: 'photo1',
        datetime: '2018-07-17T15:13:09+02:00',
        timestamp: 425509.2191666667
      },
      {
        id: 'photo2',
        name: 'photo2',
        datetime: '2018-07-17T15:14:09+02:00',
        timestamp: 425509.23583333334
      },
      {
        id: 'photo3',
        name: 'photo3',
        datetime: '2018-12-17T15:13:09+02:00',
        timestamp: 429181.2191666667
      }
    ]
    const expectedClusters = [[dataset[0], dataset[1]], [dataset[2]]]
    const params = {
      epsTemporal: 12,
      epsSpatial: 3,
      maxBound: 48,
      cosAngle: gradientAngle(15, 1)
    }
    const reachs = reachabilities(dataset, spatioTemporalScaled, params)
    const clusters = gradientClustering(dataset, reachs, params)
    expect(clusters).toEqual(expect.arrayContaining(expectedClusters))
    saveClustering(clusters).then(() => {
      cozyClient.data.findAll(DOCTYPE_ALBUMS).then(data => {
        expect(data.length).toEqual(2)
        expect(data[0].name).toEqual('2018-07-17T15:13:09+02:00')
        expect(data[0].period.start).toEqual('2018-07-17T15:13:09+02:00')
        expect(data[0].period.end).toEqual('2018-07-17T15:14:09+02:00')
        expect(data[1].name).toEqual('2018-12-17T15:13:09+02:00')
        expect(data[1].period.start).toEqual('2018-12-17T15:13:09+02:00')
        expect(data[1].period.end).toEqual('2018-12-17T15:13:09+02:00')
      })
    })
  })
})
