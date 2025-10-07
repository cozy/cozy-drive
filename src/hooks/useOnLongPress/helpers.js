const DOUBLECLICKDELAY = 400

export const handleClick = ({
  event,
  disabled,
  isRenaming,
  openLink,
  lastClickTime,
  setLastClickTime,
  toggle
}) => {
  // if default behavior is opening a file, it blocks that to force other bahavior
  event.preventDefault()

  if (disabled || isRenaming) return

  const currentTime = Date.now()
  const isDoubleClick = currentTime - lastClickTime < DOUBLECLICKDELAY

  if (isDoubleClick) {
    openLink(event)
  } else {
    toggle(event)
  }

  setLastClickTime(currentTime)
}

export const makeDesktopHandlers = ({
  timerId,
  disabled,
  isRenaming,
  openLink,
  lastClickTime,
  setLastClickTime,
  toggle
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
        disabled,
        isRenaming,
        openLink,
        lastClickTime,
        setLastClickTime,
        toggle
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
