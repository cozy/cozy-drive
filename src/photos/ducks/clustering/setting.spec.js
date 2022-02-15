import { updateParamsPeriod, createParameter } from './settings'
import { DEFAULT_EPS_TEMPORAL, DEFAULT_EPS_SPATIAL } from './consts'
import CozyClient from 'cozy-client'
jest.mock('cozy-client')
const client = new CozyClient({})

client.save = jest.fn(() => Promise.resolve({ data: {} }))

const photos = [
  {
    datetime: '2018-03-01'
  },
  {
    datetime: '2018-04-01'
  },
  {
    datetime: '2019-01-01'
  }
]

describe('setting', () => {
  it('Should update the params period ', async () => {
    const params = [
      {
        period: {
          start: '2017-01-01',
          end: '2017-12-31'
        }
      },
      {
        period: {
          start: '2018-01-01',
          end: '2018-03-01'
        }
      },
      {
        period: {
          start: '2018-03-02',
          end: '2018-12-31'
        }
      }
    ]

    const setting = {
      parameters: params
    }
    const newParams = {
      ...params[2],
      period: { start: params[2].period.start, end: photos[2].datetime }
    }
    const parameters = [...setting.parameters]
    parameters[2] = newParams

    await updateParamsPeriod(client, setting, params[2], photos)
    expect(client.save).toHaveBeenCalledWith({ ...setting, parameters })
  })

  it('Should return the correct default parameters', () => {
    const defaultParams = createParameter(photos)
    expect(defaultParams.period).toEqual({
      start: photos[0].datetime,
      end: photos[0].datetime
    })
    expect(defaultParams.evaluation).toEqual({
      start: photos[0].datetime,
      end: photos[photos.length - 1].datetime
    })
    expect(defaultParams.defaultEvaluation).toEqual(true)
    expect(defaultParams.modes[0].epsTemporal).toEqual(DEFAULT_EPS_TEMPORAL)
    expect(defaultParams.modes[0].epsSpatial).toEqual(DEFAULT_EPS_SPATIAL)
  })

  it('Should return the correct parameters', () => {
    const params = createParameter(photos, 8, 4)
    expect(params.modes[0].epsTemporal).toEqual(8)
    expect(params.modes[0].epsSpatial).toEqual(4)
    expect(params.defaultEvaluation).toEqual(false)
  })
})
