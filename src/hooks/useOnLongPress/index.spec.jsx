import MockDate from 'mockdate'

import { handlePress } from '.'

describe('handlePress function', () => {
  const mockToggle = jest.fn()
  const mockOpenLink = jest.fn()

  const ev = {
    preventDefault: jest.fn()
  }

  const setup = ({
    event = ev,
    actionMenuVisible = false,
    disabled = false,
    selectionModeActive = false,
    isDesktop = false,
    isLongPress = false,
    lastClickTime = new Date('2025-01-01T12:00:00.000Z').getTime(), // date of the first click
    isRenaming = false
  }) => {
    return {
      params: {
        event,
        actionMenuVisible,
        disabled,
        selectionModeActive,
        isDesktop,
        isLongPress,
        isRenaming,
        openLink: mockOpenLink,
        lastClickTime,
        setLastClickTime: jest.fn(),
        toggle: mockToggle
      }
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
    MockDate.reset()
  })

  describe('should do nothing if', () => {
    it('actionMenuVisible is true', () => {
      const { params } = setup({ actionMenuVisible: true })
      handlePress(params)

      expect(mockToggle).not.toHaveBeenCalled()
      expect(mockOpenLink).not.toHaveBeenCalled()
    })

    it('disabled is true', () => {
      const { params } = setup({ disabled: true })
      handlePress(params)

      expect(mockToggle).not.toHaveBeenCalled()
      expect(mockOpenLink).not.toHaveBeenCalled()
    })

    it('isRenaming is true', () => {
      const { params } = setup({ isRenaming: true })
      handlePress(params)

      expect(mockToggle).not.toHaveBeenCalledWith()
      expect(mockOpenLink).not.toHaveBeenCalled()
    })

    it('isLongPress is true', () => {
      const { params } = setup({ isLongPress: true })
      handlePress(params)

      expect(mockToggle).not.toHaveBeenCalledWith()
      expect(mockOpenLink).not.toHaveBeenCalled()
    })
  })

  describe('should only toggle if', () => {
    it('selectionModeActive', () => {
      const { params } = setup({ selectionModeActive: true })
      handlePress(params)

      expect(mockToggle).toHaveBeenCalledWith(ev)
      expect(mockOpenLink).not.toHaveBeenCalled()
    })

    it('isDesktop', () => {
      const { params } = setup({ isDesktop: true })
      handlePress(params)

      expect(mockToggle).toHaveBeenCalledWith(ev)
      expect(mockOpenLink).not.toHaveBeenCalled()
    })
  })

  describe('should only open link if', () => {
    it('not renaming', () => {
      const { params } = setup({ isRenaming: false })
      handlePress(params)

      expect(mockToggle).not.toHaveBeenCalledWith()
      expect(mockOpenLink).toHaveBeenCalledWith(ev)
    })
  })

  describe('for double click', () => {
    beforeEach(() => {
      MockDate.set('2025-01-01T12:00:00.300Z') // date of the second click
    })

    it('it should only toggle on desktop', () => {
      const { params } = setup({ isDesktop: true })
      handlePress(params)

      expect(mockToggle).not.toHaveBeenCalled()
      expect(mockOpenLink).toHaveBeenCalledWith(ev)
    })

    it('it should do nothing on desktop when renainming', () => {
      const { params } = setup({ isDesktop: true, isRenaming: true })
      handlePress(params)

      expect(mockToggle).not.toHaveBeenCalled()
      expect(mockOpenLink).not.toHaveBeenCalled()
    })

    it('it should only open link on mobile', () => {
      const { params } = setup({ isDesktop: false })
      handlePress(params)

      expect(mockToggle).not.toHaveBeenCalled()
      expect(mockOpenLink).toHaveBeenCalledWith(ev)
    })

    it('it should do nothing on mobile when renaiming', () => {
      const { params } = setup({ isDesktop: false, isRenaming: true })
      handlePress(params)

      expect(mockToggle).not.toHaveBeenCalled()
      expect(mockOpenLink).not.toHaveBeenCalled()
    })
  })
})
