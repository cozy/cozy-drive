import React from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import { createMockClient } from 'cozy-client'

import AppLike from '../../../../../../test/components/AppLike'

import usePublicFilesQuery from './usePublicFilesQuery'

describe('usePublicFilesQuery', () => {
  const mockClient = createMockClient({})
  const statByIdMock = jest.fn()

  const mockFolderId = 'folder-id-1'
  const mockData = [{ id: 1 }, { id: 2 }]

  mockClient.collection = () => ({
    statById: statByIdMock
  })

  const setup = () => {
    const wrapper = ({ children }) => (
      <AppLike client={mockClient}>{children}</AppLike>
    )

    return renderHook(() => usePublicFilesQuery(mockFolderId), {
      wrapper
    })
  }

  it('makes data available', async () => {
    statByIdMock.mockResolvedValue({
      included: mockData,
      links: {}
    })
    const { result, waitForNextUpdate } = setup()

    expect(result.current.data).toEqual([])
    expect(result.current.fetchStatus).toEqual('loading')
    expect(result.current.hasMore).toBe(false)

    await act(() => waitForNextUpdate())

    expect(result.current.fetchStatus).toEqual('loaded')
    expect(result.current.data).toEqual(mockData)
  })

  it('paginate results', async () => {
    const nextPageData = [{ id: 3 }, { id: 4 }]
    const cursor = '123abc'
    statByIdMock.mockResolvedValueOnce({
      included: mockData,
      links: {
        next: `/relative/link?page[cursor]=${cursor}&cursor=no&other=alsono`
      }
    })
    const { result, waitForNextUpdate } = setup()

    await act(() => waitForNextUpdate())

    expect(result.current.fetchStatus).toEqual('loaded')
    expect(result.current.data).toEqual(mockData)
    expect(result.current.hasMore).toEqual(true)

    statByIdMock.mockResolvedValueOnce({
      included: nextPageData,
      links: {}
    })

    await act(() => result.current.fetchMore())

    expect(statByIdMock).toHaveBeenCalledWith(mockFolderId, {
      'page[cursor]': cursor
    })
    expect(result.current.fetchStatus).toEqual('loaded')
    expect(result.current.data).toEqual(mockData.concat(nextPageData))
    expect(result.current.hasMore).toEqual(false)
  })

  it('refetches the initial data', async () => {
    statByIdMock.mockResolvedValue({
      included: mockData,
      links: {
        next: `/relative/link?page[cursor]=some-cursor&cursor=no&other=alsono`
      }
    })
    const { result, waitForNextUpdate } = setup()

    await act(() => waitForNextUpdate())

    expect(result.current.fetchStatus).toEqual('loaded')
    expect(result.current.data).toEqual(mockData)
    expect(result.current.hasMore).toEqual(true)

    await act(() => result.current.forceRefetch())

    expect(result.current.fetchStatus).toEqual('loading')

    await act(() => waitForNextUpdate())
    expect(statByIdMock).toHaveBeenCalledWith(mockFolderId, {
      'page[cursor]': undefined
    })
    expect(result.current.fetchStatus).toEqual('loaded')
    expect(result.current.data).toEqual(mockData)
    expect(result.current.hasMore).toEqual(true)
  })

  it('reports error', async () => {
    statByIdMock.mockRejectedValue()
    const { result, waitForNextUpdate } = setup()

    await act(() => waitForNextUpdate())

    expect(result.current.fetchStatus).toEqual('error')
  })
})
