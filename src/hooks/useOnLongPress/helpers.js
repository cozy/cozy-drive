import flag from 'cozy-flags'

const DOUBLECLICKDELAY = 400

export const handleClick = ({
  event,
  file,
  disabled,
  isRenaming,
  openLink,
  toggle,
  selectionModeActive,
  lastClickTime,
  setLastClickTime,
  setSelectedItems,
  setLastSelectedIndex,
  setFocusedIndex
}) => {
  // if default behavior is opening a file, it blocks that to force other bahavior
  event.preventDefault()

  if (disabled || isRenaming) return

  // simply remove this "if" the flag is not necessary anymore
  if (!flag('drive.doubleclick.enabled')) {
    if (selectionModeActive) {
      return toggle(event)
    } else {
      return openLink(event)
    }
  }

  const currentTime = Date.now()
  const isDoubleClick = currentTime - lastClickTime < DOUBLECLICKDELAY

  if (isDoubleClick) {
    openLink(event)
  } else {
    // we should not use file.index
    // we should probablt not use index - 1
    // we should use only one func to set things on click, and not 3 setters
    setSelectedItems({ [file._id]: file })
    setFocusedIndex(file.index - 1)
    setLastSelectedIndex(file.index - 1)
  }

  setLastClickTime(currentTime)
}

export const makeDesktopHandlers = ({
  file,
  timerId,
  disabled,
  isRenaming,
  openLink,
  toggle,
  selectionModeActive,
  lastClickTime,
  setLastClickTime,
  clearSelection,
  setSelectedItems,
  setLastSelectedIndex,
  setFocusedIndex
}) => {
  return {
    // first event triggered on Desktop
    onMouseDown: clearTimeout(timerId.current),
    // second event triggered on Desktop
    onMouseUp: clearTimeout(timerId.current),
    // third event triggered on Desktop
    onClick: event =>
      handleClick({
        event,
        file,
        disabled,
        isRenaming,
        openLink,
        toggle,
        selectionModeActive,
        lastClickTime,
        setLastClickTime,
        clearSelection,
        setSelectedItems,
        setLastSelectedIndex,
        setFocusedIndex
      })
  }
}

export const handlePress = ({
  event,
  disabled,
  selectionModeActive,
  isLongPress,
  isRenaming,
  openLink,
  toggle
}) => {
  // if default behavior is opening a file, it blocks that to force other bahavior
  event.preventDefault()

  // isLongPress is to prevent executing onPress twice while a longpress
  // can happen if button is released quickly just after startPressTimer execution
  if (disabled || isLongPress.current || isRenaming) return

  if (selectionModeActive) {
    toggle(event)
  } else {
    openLink(event)
  }
}

export const makeMobileHandlers = ({
  timerId,
  disabled,
  selectionModeActive,
  isRenaming,
  isLongPress,
  openLink,
  toggle
}) => {
  // used to determine if it's a longpress
  // i.e. delay onClick
  const startPressTimer = e => {
    e.persist()
    isLongPress.current = false
    timerId.current = setTimeout(() => {
      isLongPress.current = true
      if (!isRenaming) {
        toggle(e)
      }
    }, 250)
  }

  return {
    // first event triggered on Mobile when taping an item
    onTouchStart: startPressTimer,
    // second event triggered on Mobile when dragging an item
    onTouchMove: clearTimeout(timerId.current),
    // third event triggered on Mobile when taping an item
    onTouchEnd: clearTimeout(timerId.current),
    // fourth event triggered on Mobile
    onClick: event =>
      handlePress({
        event,
        disabled,
        selectionModeActive,
        isLongPress,
        isRenaming,
        openLink,
        toggle
      })
  }
}
