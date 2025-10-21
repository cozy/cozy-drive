import { renderHook, act } from '@testing-library/react-hooks'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { useClient, useQuery } from 'cozy-client'
import flag from 'cozy-flags'

import { useFolderSort } from './hooks'

import { DEFAULT_SORT, SORT_BY_UPDATE_DATE } from '@/config/sort'
import { TRASH_DIR_ID } from '@/constants/config'
import { DOCTYPE_DRIVE_SETTINGS } from '@/lib/doctypes'
import logger from '@/lib/logger'
import { sortFolder, getSort } from '@/modules/navigation/duck'

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

jest.mock('@/modules/navigation/duck', () => ({
  sortFolder: jest.fn(),
  getSort: jest.fn()
}))

const mockUseClient = useClient
const mockUseQuery = useQuery
const mockSortFolder = sortFolder
const mockGetSort = getSort
const mockFlag = flag

const createMockStore = (initialState = {}) => {
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SORT_FOLDER':
        return {
          ...state,
          view: {
            ...state.view,
            sort: {
              attribute: action.sortAttribute,
              order: action.sortOrder
            }
          }
        }
      default:
        return state
    }
  }
  return createStore(reducer)
}

// Test wrapper component
const createWrapper = store => {
  return ({ children }) => <Provider store={store}>{children}</Provider>
}

describe('useFolderSort', () => {
  let mockClient
  let mockDispatch
  let store

  beforeEach(() => {
    jest.clearAllMocks()

    mockClient = {
      save: jest.fn().mockResolvedValue({})
    }
    mockUseClient.mockReturnValue(mockClient)

    // Enable the feature flag for sorting settings
    mockFlag.mockImplementation(flagName => {
      if (flagName === 'drive.settings.save-sort-choice.enabled') {
        return true
      }
      return false
    })

    mockDispatch = jest.fn()

    store = createMockStore({
      view: {
        sort: null
      }
    })
    store.dispatch = mockDispatch

    mockSortFolder.mockImplementation((folderId, attribute, order = 'asc') => ({
      type: 'SORT_FOLDER',
      folderId,
      sortAttribute: attribute,
      sortOrder: order
    }))

    mockGetSort.mockReturnValue(null)
  })

  describe('default sort behavior', () => {
    it('should use DEFAULT_SORT for regular folders', () => {
      const folderId = 'regular-folder-id'
      mockUseQuery.mockReturnValue({
        data: [],
        fetchStatus: 'loading'
      })

      const { result } = renderHook(() => useFolderSort(folderId), {
        wrapper: createWrapper(store)
      })

      const [currentSort] = result.current
      expect(currentSort).toEqual(DEFAULT_SORT)
    })

    it('should use SORT_BY_UPDATE_DATE for trash folder', () => {
      const folderId = TRASH_DIR_ID
      mockUseQuery.mockReturnValue({
        data: [],
        fetchStatus: 'loading'
      })

      const { result } = renderHook(() => useFolderSort(folderId), {
        wrapper: createWrapper(store)
      })

      const [currentSort] = result.current
      expect(currentSort).toEqual(SORT_BY_UPDATE_DATE)
    })

    it('should use SORT_BY_UPDATE_DATE for recent folder', () => {
      const folderId = 'recent'
      mockUseQuery.mockReturnValue({
        data: [],
        fetchStatus: 'loading'
      })

      const { result } = renderHook(() => useFolderSort(folderId), {
        wrapper: createWrapper(store)
      })

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

      renderHook(() => useFolderSort(folderId), {
        wrapper: createWrapper(store)
      })

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SORT_FOLDER',
          folderId,
          sortAttribute: 'updated_at',
          sortOrder: 'desc'
        })
      )
    })

    it('should use default values when settings exist but attributes are missing', () => {
      const folderId = 'test-folder'
      const existingSettings = {
        _id: 'settings-id',
        _type: DOCTYPE_DRIVE_SETTINGS,
        attributes: {
          attribute: null,
          order: null
        }
      }

      mockUseQuery.mockReturnValue({
        data: [existingSettings],
        fetchStatus: 'loaded'
      })

      renderHook(() => useFolderSort(folderId), {
        wrapper: createWrapper(store)
      })

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SORT_FOLDER',
          folderId,
          sortAttribute: DEFAULT_SORT.attribute,
          sortOrder: DEFAULT_SORT.order
        })
      )
    })

    it('should only initialize settings once', () => {
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

      const { rerender } = renderHook(() => useFolderSort(folderId), {
        wrapper: createWrapper(store)
      })

      expect(mockDispatch).toHaveBeenCalledTimes(1)

      mockDispatch.mockClear()
      rerender()

      expect(mockDispatch).not.toHaveBeenCalled()
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

      const { result } = renderHook(() => useFolderSort(folderId), {
        wrapper: createWrapper(store)
      })

      const [, setSortOrder] = result.current
      await act(async () => {
        await setSortOrder(newSort)
      })

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SORT_FOLDER',
          folderId,
          sortAttribute: newSort.attribute,
          sortOrder: newSort.order
        })
      )

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

      const { result } = renderHook(() => useFolderSort(folderId), {
        wrapper: createWrapper(store)
      })

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

      const { result } = renderHook(() => useFolderSort(folderId), {
        wrapper: createWrapper(store)
      })

      const [, setSortOrder] = result.current
      await act(async () => {
        await setSortOrder(newSort)
      })

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'SORT_FOLDER',
          folderId,
          sortAttribute: newSort.attribute,
          sortOrder: newSort.order
        })
      )

      expect(logger.error).toHaveBeenCalledWith(
        'Failed to save sorting preference:',
        saveError
      )
    })
  })
})
