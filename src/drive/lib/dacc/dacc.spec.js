import {
  aggregateFilesSize,
  aggregateNonExcludedSlugs
} from 'drive/lib/dacc/dacc'
import { queryFilesByDate } from 'drive/lib/dacc/query'

jest.mock('drive/lib/dacc/query')

const mockedFilesQueryResponse = {
  data: [
    {
      size: 1048576,
      cozyMetadata: {
        createdByApp: 'drive'
      }
    },
    {
      size: 3145728,
      cozyMetadata: {
        createdByApp: 'drive'
      }
    },
    {
      size: 2097152,
      cozyMetadata: {
        createdByApp: 'edf'
      }
    },
    {
      size: 8388608,
      cozyMetadata: {
        createdByApp: 'maif'
      }
    },
    {
      size: 6291456,
      cozyMetadata: {
        createdByApp: 'maif-vie'
      }
    }
  ],
  next: false
}

describe('dacc service', () => {
  beforeEach(() => {
    queryFilesByDate.mockResolvedValue(mockedFilesQueryResponse)
  })
  it('should aggregate sizes by slug', async () => {
    const sizesBySlug = await aggregateFilesSize(null, '2022-01-01')
    expect(Object.keys(sizesBySlug)).toEqual([
      'drive',
      'edf',
      'maif',
      'maif-vie'
    ])
    expect(sizesBySlug['drive']).toEqual(4.194304)
    expect(sizesBySlug['edf']).toEqual(2.097152)
    expect(sizesBySlug['maif']).toEqual(8.388608)
    expect(sizesBySlug['maif-vie']).toEqual(6.291456)
  })

  it('should aggregate all sizes but excluded slug', async () => {
    const sizesBySlug = await aggregateFilesSize(null, '2022-01-01')
    const totalSize = aggregateNonExcludedSlugs(sizesBySlug, 'maif')
    expect(totalSize).toEqual(sizesBySlug['drive'] + sizesBySlug['edf'])
  })

  it('should aggregate nothing when excluded slug is empty', async () => {
    const sizesBySlug = await aggregateFilesSize(null, '2022-01-01')
    const totalSize = aggregateNonExcludedSlugs(sizesBySlug, '')
    expect(totalSize).toEqual(0)
  })
})
