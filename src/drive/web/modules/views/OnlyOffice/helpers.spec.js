import helpers, { isOnlyOfficeEditorSupported } from './helpers'

const casesToTest = [
  {
    // the doc is not shared
    isShared: false,
    isSharedWithMe: false,
    hasSharedParent: false
  },
  {
    // the doc is shared by being the owner
    isShared: true,
    isSharedWithMe: false,
    hasSharedParent: false
  },
  {
    // the doc is shared but without being the owner
    isShared: true,
    isSharedWithMe: true,
    hasSharedParent: false
  },
  {
    // the doc is inside a shared folder
    isShared: false,
    isSharedWithMe: false,
    hasSharedParent: true
  }
]

const executeTests = (file, expectations) => {
  casesToTest.forEach(
    ({ isShared, isSharedWithMe, hasSharedParent }, index) => {
      expect(
        isOnlyOfficeEditorSupported({
          file,
          isShared,
          isSharedWithMe,
          hasSharedParent
        })
      ).toBe(expectations[index])
    }
  )
}

describe('isOnlyOfficeEditorSupported', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('For a doc is not an only office one', () => {
    const file = { type: 'file', class: 'image', name: 'doc.png' }

    it('should return false no matter if it is shared', () => {
      const expectations = [false, false, false, false]
      executeTests(file, expectations)
    })

    it('should return false no matter if an only office server is configured', () => {
      jest.spyOn(helpers, 'isOnlyOfficeEnabled').mockReturnValue(true)

      const expectations = [false, false, false, false]
      executeTests(file, expectations)
    })
  })

  describe('For an only office doc', () => {
    const file = { type: 'file', class: 'slide', name: 'doc.pptx' }

    it('should return the expectation without any only office server configured', () => {
      jest.spyOn(helpers, 'isOnlyOfficeEnabled').mockReturnValue(false)

      const expectations = [false, false, true, true]
      executeTests(file, expectations)
    })

    it('should return the expectation with an only office server configured', () => {
      jest.spyOn(helpers, 'isOnlyOfficeEnabled').mockReturnValue(true)

      const expectations = [true, true, true, true]
      executeTests(file, expectations)
    })
  })
})
