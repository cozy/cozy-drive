import { aggregateFilesSize, aggregateNonExcludedSlugs } from 'lib/dacc/dacc'
import { queryAllDocsWithFields } from 'lib/dacc/query'

jest.mock('lib/dacc/query')

const mockedFilesQueryResponse = [
  {
    doc: {
      type: 'file',
      size: 1048576,
      cozyMetadata: {
        createdByApp: 'drive',
        uploadedAt: '2021-01-01'
      }
    }
  },
  {
    doc: {
      type: 'file',
      size: 3145728,
      cozyMetadata: {
        createdByApp: 'drive',
        uploadedAt: '2021-01-01'
      }
    }
  },
  {
    doc: {
      type: 'file',
      size: 4567892,
      cozyMetadata: {
        createdByApp: 'drive'
      }
    }
  },
  {
    doc: {
      type: 'file',
      size: 2097152,
      cozyMetadata: {
        createdByApp: 'edf',
        uploadedAt: '2021-01-01'
      }
    }
  },
  {
    doc: {
      type: 'file',
      size: 8388608,
      cozyMetadata: {
        createdByApp: 'maif',
        uploadedAt: '2021-01-01'
      }
    }
  },
  {
    doc: {
      type: 'file',
      size: 6291456,
      cozyMetadata: {
        createdByApp: 'maif-vie',
        uploadedAt: '2021-01-01'
      }
    }
  },
  {
    doc: {
      type: 'file',
      trashed: true,
      size: 2290000,
      cozyMetadata: {
        createdByApp: 'maif-vie',
        uploadedAt: '2021-01-01'
      }
    }
  }
]

describe('aggregateFilesSize', () => {
  beforeEach(() => {
    queryAllDocsWithFields.mockResolvedValue(mockedFilesQueryResponse)
  })
  it('should aggregate sizes by slug', async () => {
    const sizesBySlug = await aggregateFilesSize(null, new Date('2022-01-01'))
    expect(Object.keys(sizesBySlug)).toEqual([
      'trashed',
      'drive',
      'edf',
      'maif',
      'maif-vie'
    ])
    expect(sizesBySlug['drive']).toEqual(4.194)
    expect(sizesBySlug['edf']).toEqual(2.097)
    expect(sizesBySlug['maif']).toEqual(8.389)
    expect(sizesBySlug['maif-vie']).toEqual(6.291)
    expect(sizesBySlug['trashed']).toEqual(2.29)
  })

  it('should aggregate all sizes but excluded slug', async () => {
    const sizesBySlug = await aggregateFilesSize(null, new Date('2022-01-01'), {
      excludedSlug: 'maif',
      nonExcludedGroupLabel: 'not-maif'
    })
    const expectedValue =
      Math.round((sizesBySlug['drive'] + sizesBySlug['edf']) * 1000) / 1000
    expect(sizesBySlug['not-maif']).toEqual(expectedValue)
  })

  it('should skip docs not file or without uploadedAt', async () => {
    queryAllDocsWithFields.mockResolvedValueOnce([
      {
        doc: {
          type: 'file',
          size: 4567892,
          cozyMetadata: {
            createdByApp: 'drive'
          }
        }
      },
      {
        doc: {
          type: 'directory'
        }
      }
    ])
    const sizesBySlug = await aggregateFilesSize(null, new Date('2022-01-01'))
    expect(sizesBySlug).toEqual({ trashed: 0 })
  })
})

describe('aggregateNonExcludedSlugs', () => {
  it('should aggregate all sizes but excluded slug', async () => {
    const sizesBySlug = await aggregateFilesSize(null, new Date('2022-01-01'))
    const totalSize = aggregateNonExcludedSlugs(sizesBySlug, 'maif')
    expect(totalSize).toEqual(sizesBySlug['drive'] + sizesBySlug['edf'])
  })

  it('should aggregate nothing when excluded slug is empty', async () => {
    const sizesBySlug = await aggregateFilesSize(null, new Date('2022-01-01'))
    const totalSize = aggregateNonExcludedSlugs(sizesBySlug, '')
    expect(totalSize).toEqual(0)
  })
})
