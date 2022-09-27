import {
  aggregateFilesSize,
  aggregateNonExcludedSlugs
} from 'drive/lib/dacc/dacc'
import { queryAllDocsWithFields } from 'drive/lib/dacc/query'

jest.mock('drive/lib/dacc/query')

const mockedFilesQueryResponse = [
  {
    doc: {
      type: 'file',
      size: 1048576,
      cozyMetadata: {
        createdByApp: 'drive'
      }
    }
  },
  {
    doc: {
      type: 'file',
      size: 3145728,
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
        createdByApp: 'edf'
      }
    }
  },
  {
    doc: {
      type: 'file',
      size: 8388608,
      cozyMetadata: {
        createdByApp: 'maif'
      }
    }
  },
  {
    doc: {
      type: 'file',
      size: 6291456,
      cozyMetadata: {
        createdByApp: 'maif-vie'
      }
    }
  },
  {
    doc: {
      type: 'file',
      trashed: true,
      size: 2290000,
      cozyMetadata: {
        createdByApp: 'maif-vie'
      }
    }
  }
]

describe('aggregateFilesSize', () => {
  beforeEach(() => {
    queryAllDocsWithFields.mockResolvedValue(mockedFilesQueryResponse)
  })
  it('should aggregate sizes by slug', async () => {
    const sizesBySlug = await aggregateFilesSize(null, '2022-01-01')
    expect(Object.keys(sizesBySlug)).toEqual([
      'trashed',
      'drive',
      'edf',
      'maif',
      'maif-vie'
    ])
    expect(sizesBySlug['drive']).toEqual(4.19)
    expect(sizesBySlug['edf']).toEqual(2.1)
    expect(sizesBySlug['maif']).toEqual(8.39)
    expect(sizesBySlug['maif-vie']).toEqual(6.29)
    expect(sizesBySlug['trashed']).toEqual(2.29)
  })

  it('should aggregate all sizes but excluded slug', async () => {
    const sizesBySlug = await aggregateFilesSize(null, '2022-01-01', {
      excludedSlug: 'maif',
      nonExcludedGroupLabel: 'not-maif'
    })
    const expectedValue =
      Math.round((sizesBySlug['drive'] + sizesBySlug['edf']) * 100) / 100
    expect(sizesBySlug['not-maif']).toEqual(expectedValue)
  })
})

describe('aggregateNonExcludedSlugs', () => {
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
