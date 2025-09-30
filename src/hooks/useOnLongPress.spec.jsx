import { handlePress } from './useOnLongPress'

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
        toggle: mockToggle
      }
    }
  }

  afterEach(() => {
    jest.clearAllMocks()
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
})
