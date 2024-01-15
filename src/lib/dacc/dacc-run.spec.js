import { endOfMonth, subMonths } from 'date-fns'

import CozyClient from 'cozy-client'
import flag from 'cozy-flags'
import log from 'cozy-logger'

import { run } from './dacc-run'
import { aggregateFilesSize } from 'lib/dacc/dacc'

jest.mock('cozy-flags')
jest.mock('cozy-client')
jest.mock('cozy-logger')
jest.mock('lib/dacc/dacc')

describe('dacc', () => {
  const maxGivenDate = '2022-01-01'
  const maxDate = new Date(maxGivenDate).toISOString()
  beforeEach(() => {
    flag.mockReturnValue({
      excludedSlug: 'excludedSlug',
      nonExcludedGroupLabel: 'nonExcludedGroupLabel',
      measureName: 'measureName',
      remoteDoctype: 'remoteDoctype',
      maxFileDateQuery: maxGivenDate
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should do nothing when no flag is set', async () => {
    // Given
    flag.mockReturnValueOnce(null)

    // When
    await run()

    // Then
    expect(aggregateFilesSize).toHaveBeenCalledTimes(0)
  })

  it('should aggregateFilesSize with max file date query', async () => {
    // Given
    const client = 'client'
    CozyClient.fromEnv.mockReturnValue(client)
    aggregateFilesSize.mockResolvedValueOnce([])

    // When
    await run()

    // Then
    expect(aggregateFilesSize).toHaveBeenCalledWith(client, maxDate, {
      excludedSlug: 'excludedSlug',
      nonExcludedGroupLabel: 'nonExcludedGroupLabel'
    })
  })

  it('should aggregateFilesSize with end date of this month when max file date query not found', async () => {
    // Given
    const client = 'client'
    CozyClient.fromEnv.mockReturnValue(client)
    aggregateFilesSize.mockResolvedValueOnce([])
    flag.mockReturnValue({
      excludedSlug: 'excludedSlug',
      nonExcludedGroupLabel: 'nonExcludedGroupLabel',
      measureName: 'measureName',
      remoteDoctype: 'remoteDoctype'
    })
    const endOfThisMonth = new Date(
      endOfMonth(subMonths(new Date(), 1))
    ).toISOString()

    // When
    await run()

    // Then
    expect(aggregateFilesSize).toHaveBeenCalledWith(client, endOfThisMonth, {
      excludedSlug: 'excludedSlug',
      nonExcludedGroupLabel: 'nonExcludedGroupLabel'
    })
  })

  it('should log when there is no sizes by slug', async () => {
    // Given
    aggregateFilesSize.mockResolvedValueOnce([])

    // When
    await run()

    const date = new Date(maxDate).toISOString()

    // Then
    expect(log).toHaveBeenNthCalledWith(
      2,
      'info',
      `No files found to aggregate with date ${date}`
    )
  })

  it('should not log when there are sizes by slug', async () => {
    // Given
    aggregateFilesSize.mockResolvedValueOnce([{}])

    // When
    await run()

    // Then
    expect(log).toHaveBeenCalledTimes(1)
  })
})
