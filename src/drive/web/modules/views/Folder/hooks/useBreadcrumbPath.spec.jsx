import { useBreadcrumbPath } from './useBreadcrumbPath'
import { act, renderHook } from '@testing-library/react-hooks'
import { useClient } from 'cozy-client'
import { fetchFolder } from '../queries/fetchFolder'
import log from 'cozy-logger'
import {
  dummyBreadcrumbPath,
  dummyRootBreadcrumbPath
} from 'test/dummies/dummyBreadcrumbPath'

jest.mock('cozy-logger')
jest.mock('cozy-client')
jest.mock('../queries/fetchFolder')

describe('useBreadcrumbPath', () => {
  const rootBreadcrumbPath = dummyRootBreadcrumbPath()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should get useClient from cozy-client', () => {
    // When
    renderHook(() => useBreadcrumbPath({}))

    // Then
    expect(useClient).toHaveBeenCalledWith()
  })

  it('should return only Drive link when id undefined', async () => {
    // When
    const { result } = await renderHook(() =>
      useBreadcrumbPath({ rootBreadcrumbPath })
    )

    // Then
    expect(result.current).toEqual([rootBreadcrumbPath])
  })

  it('should return only Drive link when id is root_breadcrumb_path id', async () => {
    // When
    let render
    await act(async () => {
      render = await renderHook(() =>
        useBreadcrumbPath({
          rootBreadcrumbPath,
          currentFolderId: rootBreadcrumbPath.id
        })
      )
    })

    // Then
    expect(render.result.current).toEqual([dummyRootBreadcrumbPath()])
  })

  it('should call fetch folder', async () => {
    // Given
    const currentFolderId = '1234'
    useClient.mockReturnValue('cozy-client')
    fetchFolder.mockReturnValueOnce({ dir_id: rootBreadcrumbPath.id })

    // When
    await act(async () => {
      await renderHook(() =>
        useBreadcrumbPath({ rootBreadcrumbPath, currentFolderId })
      )
    })

    // Then
    expect(fetchFolder).toHaveBeenCalledWith({
      client: 'cozy-client',
      folderId: currentFolderId
    })
  })

  it('should log error when fetchFolder rejects error', async () => {
    // Given
    const currentFolderId = '1234'
    useClient.mockReturnValue('cozy-client')
    fetchFolder.mockRejectedValue('error')

    // When
    let render
    await act(async () => {
      render = await renderHook(() =>
        useBreadcrumbPath({ rootBreadcrumbPath, currentFolderId })
      )
    })

    // Then
    expect(render.result.current).toEqual([rootBreadcrumbPath])
    expect(log).toHaveBeenCalledWith(
      'error',
      'Error while fetching folder for breadcrumbs of folder id: 1234, here is the error: error'
    )
  })

  it('should not loop when fetchFolder returns undefined', async () => {
    // Given
    const currentFolderId = '1234'
    useClient.mockReturnValue('cozy-client')
    fetchFolder.mockReturnValueOnce(undefined)

    // When
    await act(async () => {
      await renderHook(() =>
        useBreadcrumbPath({ rootBreadcrumbPath, currentFolderId })
      )
    })

    // Then
    expect(fetchFolder).toHaveBeenCalledTimes(1)
  })

  it('should fetch several folder until rootBreadcrumbPath.id', async () => {
    // Given
    const currentFolderId = 'currentFolderId'
    const parentFolderId = 'parentFolderId'
    const grandParentFolderId = 'grandParentFolderId'
    useClient.mockReturnValue('cozy-client')
    fetchFolder.mockReturnValueOnce({
      id: currentFolderId,
      name: 'current',
      dir_id: parentFolderId
    })
    fetchFolder.mockReturnValueOnce({
      id: parentFolderId,
      name: 'parent',
      dir_id: grandParentFolderId
    })
    fetchFolder.mockReturnValueOnce({
      id: grandParentFolderId,
      name: 'grandParent',
      dir_id: rootBreadcrumbPath.id
    })

    // When
    let render
    await act(async () => {
      render = await renderHook(() =>
        useBreadcrumbPath({ rootBreadcrumbPath, currentFolderId })
      )
    })

    // Then
    expect(fetchFolder).toHaveBeenCalledTimes(3)
    expect(fetchFolder).toHaveBeenCalledWith({
      client: 'cozy-client',
      folderId: currentFolderId
    })
    expect(fetchFolder).toHaveBeenNthCalledWith(2, {
      client: 'cozy-client',
      folderId: parentFolderId
    })
    expect(render.result.current).toEqual(dummyBreadcrumbPath())
  })

  it('should not call fetch folder, on rerender', async () => {
    // Given
    const currentFolderId = '1234'
    useClient.mockReturnValue('cozy-client')
    fetchFolder.mockReturnValueOnce({ dir_id: rootBreadcrumbPath.id })

    // When
    let render
    await act(async () => {
      render = await renderHook(() =>
        useBreadcrumbPath({ rootBreadcrumbPath, currentFolderId })
      )
    })
    expect(fetchFolder).toHaveBeenCalledTimes(1)

    render.rerender()

    // Then
    expect(fetchFolder).toHaveBeenCalledTimes(1)
  })

  it('should not add rootBreadcrumbPath when name undefined on PublicView', async () => {
    // Given
    const publicViewRootBreadcrumbPath = {
      id: rootBreadcrumbPath.id,
      name: 'Public'
    }
    const currentFolderId = 'currentFolderId'
    useClient.mockReturnValue('cozy-client')
    fetchFolder.mockReturnValueOnce({
      id: currentFolderId,
      name: 'current',
      dir_id: publicViewRootBreadcrumbPath.id
    })

    // When
    let render
    await act(async () => {
      render = await renderHook(() =>
        useBreadcrumbPath({
          rootBreadcrumbPath: publicViewRootBreadcrumbPath,
          currentFolderId
        })
      )
    })

    // Then
    expect(render.result.current).toEqual([
      { id: 'currentFolderId', name: 'current' }
    ])
  })

  it('should fetch folder until first shared documents on SharingView', async () => {
    // Given
    const currentFolderId = 'currentFolderId'
    const parentFolderId = 'parentFolderId'
    const notSharedFolderId = 'notSharedFolderId'
    const sharedDocumentIds = [parentFolderId, 'another-id']
    useClient.mockReturnValue('cozy-client')
    fetchFolder.mockReturnValueOnce({
      id: currentFolderId,
      name: 'current',
      dir_id: parentFolderId
    })
    fetchFolder.mockReturnValueOnce({
      id: parentFolderId,
      name: 'parent',
      dir_id: notSharedFolderId
    })
    fetchFolder.mockReturnValueOnce({
      id: notSharedFolderId,
      name: 'whatever-not-called',
      dir_id: 'whatever-not-called-id'
    })
    const sharingsViewRootBreadcrumbPath = {
      id: rootBreadcrumbPath.id,
      name: 'Sharings'
    }

    // When
    let render
    await act(async () => {
      render = await renderHook(() =>
        useBreadcrumbPath({
          rootBreadcrumbPath: sharingsViewRootBreadcrumbPath,
          currentFolderId,
          sharedDocumentIds
        })
      )
    })

    // Then
    expect(render.result.current).toEqual([
      sharingsViewRootBreadcrumbPath,
      { id: 'parentFolderId', name: 'parent' },
      { id: 'currentFolderId', name: 'current' }
    ])
  })

  it('should fetch folder until first shared documents on SharingView', async () => {
    // Given
    const currentFolderId = 'currentFolderId'
    const parentFolderId = 'parentFolderId'
    const notSharedFolderId = 'notSharedFolderId'
    const sharedDocumentIds = [parentFolderId, currentFolderId, 'another-id']
    useClient.mockReturnValue('cozy-client')
    fetchFolder.mockReturnValueOnce({
      id: currentFolderId,
      name: 'current',
      dir_id: parentFolderId
    })
    fetchFolder.mockReturnValueOnce({
      id: parentFolderId,
      name: 'parent',
      dir_id: notSharedFolderId
    })
    const sharingsViewRootBreadcrumbPath = {
      id: rootBreadcrumbPath.id,
      name: 'Sharings'
    }

    // When
    let render
    await act(async () => {
      render = await renderHook(() =>
        useBreadcrumbPath({
          rootBreadcrumbPath: sharingsViewRootBreadcrumbPath,
          currentFolderId,
          sharedDocumentIds
        })
      )
    })

    // Then
    expect(render.result.current).toEqual([
      sharingsViewRootBreadcrumbPath,
      { id: 'currentFolderId', name: 'current' }
    ])
  })
})
