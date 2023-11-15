import { renderHook, act } from '@testing-library/react-hooks'
import { useClient } from 'cozy-client'
import { useSearchParams } from 'react-router-dom'
import { useRedirectLink } from './useRedirectLink'

jest.mock('cozy-client', () => ({
  ...jest.requireActual('cozy-client'),
  useClient: jest.fn()
}))
jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn()
}))

const realLocation = window.location

describe('useRedirectLink', () => {
  const mockClient = {
    collection: jest.fn().mockReturnValue({
      fetchOwnPermissions: jest.fn().mockResolvedValue({
        included: []
      })
    }),
    getStackClient: jest.fn().mockReturnValue({
      uri: 'https://my.cozy.cloud'
    }),
    getInstanceOptions: jest.fn().mockReturnValue({
      subdomain: 'flat'
    })
  }

  beforeEach(() => {
    useClient.mockReturnValue(mockClient)
    useSearchParams.mockReturnValue([
      new URLSearchParams('?redirectLink=drive%23%2Ffolder%2Fid123')
    ])
    window.location = realLocation
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return null if redirectLink is null', async () => {
    useSearchParams.mockReturnValue([new URLSearchParams()])

    let render
    await act(async () => {
      render = renderHook(() => useRedirectLink())
    })

    expect(render.result.current.redirectWebLink).toBeNull()
    expect(render.result.current.redirectLink).toBeNull()
  })

  it('should return a redirectWebLink if fetchStatus is loaded', async () => {
    let render
    await act(async () => {
      render = renderHook(() => useRedirectLink())
    })

    expect(render.result.current.redirectWebLink).toBe(
      'https://my-drive.cozy.cloud/#/folder/id123'
    )
    expect(render.result.current.redirectLink).toBe('drive#/folder/id123')
  })

  it('should return a redirectWebLink as null if fetchStatus is failed', async () => {
    mockClient
      .collection()
      .fetchOwnPermissions.mockImplementation(() => Promise.reject())

    let render
    await act(async () => {
      render = renderHook(() => useRedirectLink())
    })

    expect(render.result.current.redirectWebLink).toBeNull()
    expect(render.result.current.redirectLink).toBe('drive#/folder/id123')
  })

  it('should return a redirectWebLink to the instance that opened the shared file', async () => {
    mockClient.collection().fetchOwnPermissions.mockResolvedValueOnce({
      included: [
        {
          attributes: {
            instance: 'https://other.cozy.cloud'
          }
        }
      ]
    })

    let render
    await act(async () => {
      render = renderHook(() => useRedirectLink())
    })

    expect(render.result.current.redirectWebLink).toBe(
      'https://other-drive.cozy.cloud/#/folder/id123'
    )
    expect(render.result.current.redirectLink).toBe('drive#/folder/id123')
  })

  it('should return a redirectWebLink to current instance if the file was opened from an public folder', async () => {
    delete window.location
    window.location = new URL('https://my.cozy.cloud/public?sharecode=share123')
    useSearchParams.mockReturnValue([
      new URLSearchParams(
        '?redirectLink=drive%23%2Ffolder%2Fid123&fromPublicFolder=true'
      )
    ])
    mockClient.collection().fetchOwnPermissions.mockResolvedValueOnce({
      included: [
        {
          attributes: {
            instance: 'https://other.cozy.cloud'
          }
        }
      ]
    })

    let render
    await act(async () => {
      render = renderHook(() => useRedirectLink())
    })

    expect(render.result.current.redirectWebLink).toBe(
      'https://my-drive.cozy.cloud/public?sharecode=share123#/folder/id123'
    )
    expect(render.result.current.redirectLink).toBe('drive#/folder/id123')
  })
})
