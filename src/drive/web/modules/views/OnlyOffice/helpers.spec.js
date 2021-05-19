import helpers, { isOnlyOfficeEditorSupported } from './helpers'

describe('isOnlyOfficeEditorSupported', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('For a doc is not an only office one', () => {
    const file = { type: 'file', class: 'image', name: 'doc.png' }

    it('should return false no matter if it is shared', () => {
      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: false,
          isSharedWithMe: false
        })
      ).toBeFalsy()

      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: true,
          isSharedWithMe: false
        })
      ).toBeFalsy()

      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: true,
          isSharedWithMe: true
        })
      ).toBeFalsy()
    })

    it('should return false no matter if an only office server is configured', () => {
      jest.spyOn(helpers, 'isOnlyOfficeEnabled').mockReturnValue(true)

      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: false,
          isSharedWithMe: false
        })
      ).toBeFalsy()

      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: true,
          isSharedWithMe: false
        })
      ).toBeFalsy()

      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: true,
          isSharedWithMe: true
        })
      ).toBeFalsy()
    })
  })

  describe('For an only office doc, without any only office server configured', () => {
    const file = { type: 'file', class: 'slide', name: 'doc.pptx' }

    beforeEach(() => {
      jest.spyOn(helpers, 'isOnlyOfficeEnabled').mockReturnValue(false)
    })

    it('should return false if the doc is not shared', () => {
      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: false,
          isSharedWithMe: false
        })
      ).toBeFalsy()
    })

    it('should return false if the doc is shared by being the owner', () => {
      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: true,
          isSharedWithMe: false
        })
      ).toBeFalsy()
    })

    it('should return true if the doc is shared but without being the owner', () => {
      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: true,
          isSharedWithMe: true
        })
      ).toBeTruthy()
    })
  })

  describe('For an only office doc, with an only office server configured', () => {
    const file = { type: 'file', class: 'slide', name: 'doc.pptx' }

    beforeEach(() => {
      jest.spyOn(helpers, 'isOnlyOfficeEnabled').mockReturnValue(true)
    })

    it('should return true if the doc is not shared', () => {
      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: false,
          isSharedWithMe: false
        })
      ).toBeTruthy()
    })

    it('should return true if the doc is shared by being the owner', () => {
      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: true,
          isSharedWithMe: false
        })
      ).toBeTruthy()
    })

    it('should return true if the doc is shared but without being the owner', () => {
      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared: true,
          isSharedWithMe: true
        })
      ).toBeTruthy()
    })
  })
})
