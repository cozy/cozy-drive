import { act, renderHook } from '@testing-library/react'

import { FILE_PICKER_VIEW_TYPE_STORAGE_KEY } from './constants'
import { useFilePickerViewType } from './useFilePickerViewType'

const storageKey = FILE_PICKER_VIEW_TYPE_STORAGE_KEY

describe('useFilePickerViewType', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    window.localStorage.removeItem(storageKey)
  })

  it.each(['list', 'grid'])('restores a stored %s view', viewType => {
    window.localStorage.setItem(storageKey, viewType)

    const { result } = renderHook(() => useFilePickerViewType())

    expect(result.current[0]).toBe(viewType)
  })

  it.each([null, '{"viewType":"grid"}'])(
    'defaults to list without rewriting a missing or invalid preference: %s',
    stored => {
      if (stored !== null) window.localStorage.setItem(storageKey, stored)

      const { result } = renderHook(() => useFilePickerViewType())

      expect(result.current[0]).toBe('list')
      expect(window.localStorage.getItem(storageKey)).toBe(stored)
    }
  )

  it('persists explicitly chosen views', () => {
    const { result } = renderHook(() => useFilePickerViewType())

    act(() => result.current[1]('grid'))
    expect(result.current[0]).toBe('grid')
    expect(window.localStorage.getItem(storageKey)).toBe('grid')

    act(() => result.current[1]('list'))
    expect(result.current[0]).toBe('list')
    expect(window.localStorage.getItem(storageKey)).toBe('list')
  })

  it('ignores an invalid view change without overwriting the preference', () => {
    window.localStorage.setItem(storageKey, 'grid')
    const { result } = renderHook(() => useFilePickerViewType())

    act(() => result.current[1]('invalid'))

    expect(result.current[0]).toBe('grid')
    expect(window.localStorage.getItem(storageKey)).toBe('grid')
  })

  it('defaults to list when reading the preference throws', () => {
    window.localStorage.setItem(storageKey, 'grid')
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage access denied', 'SecurityError')
    })

    const { result } = renderHook(() => useFilePickerViewType())

    expect(result.current[0]).toBe('list')
  })

  it('switches views in memory without changing the preference when writing throws', () => {
    window.localStorage.setItem(storageKey, 'list')
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage quota exceeded', 'QuotaExceededError')
    })
    const { result } = renderHook(() => useFilePickerViewType())

    act(() => result.current[1]('grid'))

    expect(result.current[0]).toBe('grid')
    expect(window.localStorage.getItem(storageKey)).toBe('list')
  })

  it('defaults to list and switches views when the storage getter throws', () => {
    const storage = window.localStorage
    storage.setItem(storageKey, 'grid')
    jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
      throw new DOMException('Storage access denied', 'SecurityError')
    })
    const { result } = renderHook(() => useFilePickerViewType())
    expect(result.current[0]).toBe('list')

    act(() => result.current[1]('grid'))
    expect(result.current[0]).toBe('grid')
    act(() => result.current[1]('list'))
    expect(result.current[0]).toBe('list')
    expect(storage.getItem(storageKey)).toBe('grid')
  })
})
