import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

import { CozyProvider, createMockClient } from 'cozy-client'

import { useReportSpaceFiles } from './useReportSpaceFiles'

import { ROUTER_FUTURE_FLAGS } from '@/constants/config'
import { reportSpaceFiles } from '@/modules/views/Space/SpaceLayout'

jest.mock('@/modules/views/Space/SpaceLayout', () => ({
  reportSpaceFiles: jest.fn()
}))

describe('useReportSpaceFiles', () => {
  const setup = ({ pathname, lastUpdate = 1 }) => {
    const client = createMockClient({})
    const fetchJSON = jest
      .fn()
      .mockResolvedValue({ data: { attributes: { files_count: 42 } } })
    client.getStackClient = () => ({ fetchJSON })

    const hook = renderHook(
      ({ lastUpdate }) => useReportSpaceFiles('drive-1', 'root-1', lastUpdate),
      {
        initialProps: { lastUpdate },
        wrapper: ({ children }) => (
          <CozyProvider client={client}>
            <MemoryRouter
              initialEntries={[pathname]}
              future={ROUTER_FUTURE_FLAGS}
            >
              {children}
            </MemoryRouter>
          </CozyProvider>
        )
      }
    )
    return { ...hook, fetchJSON }
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('reports the files of the whole drive from any of its folders', async () => {
    const { fetchJSON, rerender } = setup({
      pathname: '/embed/sharings/drive-1/sub-folder'
    })

    await waitFor(() =>
      expect(reportSpaceFiles).toHaveBeenCalledWith('drive-1', 42)
    )
    expect(fetchJSON).toHaveBeenCalledWith(
      'GET',
      '/sharings/drives/drive-1/root-1/size'
    )

    rerender({ lastUpdate: 2 })
    await waitFor(() => expect(reportSpaceFiles).toHaveBeenCalledTimes(2))
  })

  it('does not fetch the count outside a space', () => {
    const { fetchJSON } = setup({ pathname: '/shareddrive/drive-1/root-1' })

    expect(fetchJSON).not.toHaveBeenCalled()
  })

  it('waits for the folder to be loaded', () => {
    const { fetchJSON } = setup({
      pathname: '/embed/sharings/drive-1/root-1',
      lastUpdate: null
    })

    expect(fetchJSON).not.toHaveBeenCalled()
  })
})
