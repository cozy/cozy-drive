import { renderHook, act } from '@testing-library/react-hooks'

import { useClient, useQuery } from 'cozy-client'
import flag from 'cozy-flags'

import { useFolderSort } from './index'

import { DEFAULT_SORT, SORT_BY_UPDATE_DATE } from '@/config/sort'
import { TRASH_DIR_ID } from '@/constants/config'
import { DOCTYPE_DRIVE_SETTINGS } from '@/lib/doctypes'
import logger from '@/lib/logger'

jest.mock('cozy-client', () => ({
  useClient: jest.fn(),
  Q: jest.fn(),
  useQuery: jest.fn()
}))

jest.mock('cozy-flags', () => jest.fn())

jest.mock('@/lib/logger', () => ({
  warn: jest.fn(),
  info: jest.fn(),
  error: jest.fn()
}))

const mockUseClient = useClient
const mockUseQuery = useQuery
const mockFlag = flag

describe('useFolderSort', () => {
  let mockClient

  beforeEach(() => {
    jest.clearAllMocks()

    mockClient = {
      save: jest.fn().mockResolvedValue({})
    }
    mockUseClient.mockReturnValue(mockClient)

    mockFlag.mockImplementation(flagName => {
      if (flagName === 'drive.save-sort-choice.enabled') {
        return true
      }
      return false
    })
  })

  describe('default sort behavior', () => {
    it('should use DEFAULT_SORT for regular folders', () => {
      const folderId = 'regular-folder-id'
      mockUseQuery.mockReturnValue({
        data: [],
        fetchStatus: 'loading'
      })

      const { result } = renderHook(() => useFolderSort(folderId))

      const [currentSort] = result.current
      expect(currentSort).toEqual(DEFAULT_SORT)
    })

    it('should use SORT_BY_UPDATE_DATE for trash folder', () => {
      const folderId = TRASH_DIR_ID
      mockUseQuery.mockReturnValue({
        data: [],
        fetchStatus: 'loading'
      })

      const { result } = renderHook(() => useFolderSort(folderId))

      const [currentSort] = result.current
      expect(currentSort).toEqual(SORT_BY_UPDATE_DATE)
    })

    it('should use SORT_BY_UPDATE_DATE for recent folder', () => {
      const folderId = 'recent'
      mockUseQuery.mockReturnValue({
        data: [],
        fetchStatus: 'loading'
      })

      const { result } = renderHook(() => useFolderSort(folderId))

      const [currentSort] = result.current
      expect(currentSort).toEqual(SORT_BY_UPDATE_DATE)
    })
  })

  describe('loading existing sorting settings', () => {
    it('should load and apply existing sorting settings when available', () => {
      const folderId = 'test-folder'
      const existingSettings = {
        _id: 'settings-id',
        _type: DOCTYPE_DRIVE_SETTINGS,
        attributes: {
          attribute: 'updated_at',
          order: 'desc'
        }
      }

      mockUseQuery.mockReturnValue({
        data: [existingSettings],
        fetchStatus: 'loaded'
      })

      const { result } = renderHook(() => useFolderSort(folderId))

      const [currentSort] = result.current
      expect(currentSort).toEqual({
        attribute: 'updated_at',
        order: 'desc'
      })
    })

    it('should use default values when settings exist but attributes are missing', () => {
      const folderId = 'test-folder'
      const existingSettings = {
        _id: 'settings-id',
        _type: DOCTYPE_DRIVE_SETTINGS
      }

      mockUseQuery.mockReturnValue({
        data: [existingSettings],
        fetchStatus: 'loaded'
      })

      const { result } = renderHook(() => useFolderSort(folderId))

      const [currentSort] = result.current
      expect(currentSort).toEqual(DEFAULT_SORT)
    })

    it('should return consistent sort values on multiple renders', () => {
      const folderId = 'test-folder'
      const existingSettings = {
        _id: 'settings-id',
        _type: DOCTYPE_DRIVE_SETTINGS,
        attributes: {
          attribute: 'name',
          order: 'asc'
        }
      }

      mockUseQuery.mockReturnValue({
        data: [existingSettings],
        fetchStatus: 'loaded'
      })

      const { result, rerender } = renderHook(() => useFolderSort(folderId))

      const [firstSort] = result.current
      expect(firstSort).toEqual({
        attribute: 'name',
        order: 'asc'
      })

      rerender()

      const [secondSort] = result.current
      expect(secondSort).toEqual({
        attribute: 'name',
        order: 'asc'
      })
    })
  })

  describe('persisting settings', () => {
    it('should persist new sorting settings when no existing settings', async () => {
      const folderId = 'test-folder'
      const newSort = { attribute: 'updated_at', order: 'desc' }

      mockUseQuery.mockReturnValue({
        data: [],
        fetchStatus: 'loaded'
      })

      const { result } = renderHook(() => useFolderSort(folderId))

      const [, setSortOrder] = result.current
      await act(async () => {
        await setSortOrder(newSort)
      })

      expect(mockClient.save).toHaveBeenCalledWith({
        _type: DOCTYPE_DRIVE_SETTINGS,
        attributes: newSort
      })

      expect(logger.info).toHaveBeenCalledWith(
        'Sort settings persisted',
        newSort
      )
    })

    it('should update existing sorting settings', async () => {
      const folderId = 'test-folder'
      const existingSettings = {
        _id: 'settings-id',
        _type: DOCTYPE_DRIVE_SETTINGS,
        attributes: {
          attribute: 'name',
          order: 'asc'
        }
      }
      const newSort = { attribute: 'updated_at', order: 'desc' }

      mockUseQuery.mockReturnValue({
        data: [existingSettings],
        fetchStatus: 'loaded'
      })

      const { result } = renderHook(() => useFolderSort(folderId))

      const [, setSortOrder] = result.current
      await act(async () => {
        await setSortOrder(newSort)
      })

      expect(mockClient.save).toHaveBeenCalledWith({
        ...existingSettings,
        attributes: newSort
      })

      expect(logger.info).toHaveBeenCalledWith(
        'Sort settings persisted',
        newSort
      )
    })

    it('should handle save errors gracefully', async () => {
      const folderId = 'test-folder'
      const newSort = { attribute: 'updated_at', order: 'desc' }
      const saveError = new Error('Save failed')

      mockClient.save.mockRejectedValue(saveError)
      mockUseQuery.mockReturnValue({
        data: [],
        fetchStatus: 'loaded'
      })

      const { result } = renderHook(() => useFolderSort(folderId))

      const [, setSortOrder] = result.current
      await act(async () => {
        await setSortOrder(newSort)
      })

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to save sorting preference:',
        saveError
      )
    })
  })
})
