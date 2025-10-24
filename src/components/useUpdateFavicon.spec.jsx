import { renderHook } from '@testing-library/react-hooks'

import flag from 'cozy-flags'

import useUpdateFavicon from './useUpdateFavicon'

jest.mock('cozy-flags')
jest.mock('@/lib/getFileMimetype', () => ({
  getFileMimetype: jest.fn()
}))

const mockFlag = flag

const mockQuerySelectorAll = jest.fn()
const mockAppendChild = jest.fn()

const createMockLinkElement = () => ({
  rel: '',
  type: '',
  href: ''
})

describe('useUpdateFavicon', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    Object.defineProperty(document, 'querySelectorAll', {
      value: mockQuerySelectorAll,
      writable: true
    })

    Object.defineProperty(document.head, 'appendChild', {
      value: mockAppendChild,
      writable: true
    })

    mockQuerySelectorAll.mockReturnValue([createMockLinkElement()])
  })

  describe('when conditions are not met for custom favicon', () => {
    it('should use default favicon when fetchStatus is not loaded', () => {
      const file = {
        _id: '1',
        name: 'document.docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }

      mockFlag.mockReturnValue(true)
      const mockLink = createMockLinkElement()
      mockQuerySelectorAll.mockReturnValue([mockLink])

      renderHook(() => useUpdateFavicon(file, 'loading'))

      expect(mockQuerySelectorAll).toHaveBeenCalledWith("link[rel~='icon']")
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockLink.href).toBe('/assets/favicon.ico')
      expect(mockLink.rel).toBe('icon')
      expect(mockLink.type).toBe('image/svg+xml')
    })

    it('should use default favicon when file is undefined', () => {
      mockFlag.mockReturnValue(true)
      const mockLink = createMockLinkElement()
      mockQuerySelectorAll.mockReturnValue([mockLink])

      renderHook(() => useUpdateFavicon(undefined, 'loaded'))

      expect(mockQuerySelectorAll).toHaveBeenCalledWith("link[rel~='icon']")
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockLink.href).toBe('/assets/favicon.ico')
    })

    it('should use default favicon when flag is disabled', () => {
      const file = {
        _id: '1',
        name: 'document.docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }

      mockFlag.mockReturnValue(false)
      const mockLink = createMockLinkElement()
      mockQuerySelectorAll.mockReturnValue([mockLink])

      renderHook(() => useUpdateFavicon(file, 'loaded'))

      expect(mockQuerySelectorAll).toHaveBeenCalledWith("link[rel~='icon']")
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockLink.href).toBe('/assets/favicon.ico')
    })
  })

  describe('when conditions are met for custom favicon', () => {
    beforeEach(() => {
      mockFlag.mockReturnValue(true)
    })

    it('should use text favicon for text type files', () => {
      const file = {
        _id: '1',
        name: 'document.docx',
        mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      }

      const { getFileMimetype } = require('@/lib/getFileMimetype')
      getFileMimetype.mockReturnValue(() => 'text')
      const mockLink = createMockLinkElement()
      mockQuerySelectorAll.mockReturnValue([mockLink])

      renderHook(() => useUpdateFavicon(file, 'loaded'))

      expect(mockQuerySelectorAll).toHaveBeenCalledWith("link[rel~='icon']")
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockLink.href).toBe('/favicons/icon-onlyoffice-text.ico')
      expect(mockLink.rel).toBe('icon')
      expect(mockLink.type).toBe('image/svg+xml')
    })

    it('should use sheet favicon for sheet type files', () => {
      const file = {
        _id: '1',
        name: 'spreadsheet.xlsx',
        mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }

      const { getFileMimetype } = require('@/lib/getFileMimetype')
      getFileMimetype.mockReturnValue(() => 'sheet')
      const mockLink = createMockLinkElement()
      mockQuerySelectorAll.mockReturnValue([mockLink])

      renderHook(() => useUpdateFavicon(file, 'loaded'))

      expect(mockQuerySelectorAll).toHaveBeenCalledWith("link[rel~='icon']")
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockLink.href).toBe('/favicons/icon-onlyoffice-sheet.ico')
    })

    it('should use slide favicon for slide type files', () => {
      const file = {
        _id: '1',
        name: 'presentation.pptx',
        mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      }

      const { getFileMimetype } = require('@/lib/getFileMimetype')
      getFileMimetype.mockReturnValue(() => 'slide')
      const mockLink = createMockLinkElement()
      mockQuerySelectorAll.mockReturnValue([mockLink])

      renderHook(() => useUpdateFavicon(file, 'loaded'))

      expect(mockQuerySelectorAll).toHaveBeenCalledWith("link[rel~='icon']")
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockLink.href).toBe('/favicons/icon-onlyoffice-slide.ico')
    })

    it('should use default favicon when file type does not exist in mapping', () => {
      const file = {
        _id: '1',
        name: 'image.jpg',
        mime: 'image/jpeg'
      }

      const { getFileMimetype } = require('@/lib/getFileMimetype')
      getFileMimetype.mockReturnValue(() => undefined)
      const mockLink = createMockLinkElement()
      mockQuerySelectorAll.mockReturnValue([mockLink])

      renderHook(() => useUpdateFavicon(file, 'loaded'))

      expect(mockQuerySelectorAll).toHaveBeenCalledWith("link[rel~='icon']")
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockLink.href).toBe('/assets/favicon.ico')
    })
  })
})
