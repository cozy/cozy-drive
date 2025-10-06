import { useRef, useState } from 'react'

import flag from 'cozy-flags'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useSelectionContext } from '@/modules/selection/SelectionProvider'

const DOUBLECLICKDELAY = 400

export const handlePress = ({
  event,
  actionMenuVisible,
  disabled,
  selectionModeActive,
  isDesktop,
  isLongPress,
  isRenaming,
  openLink,
  lastClickTime,
  setLastClickTime,
  toggle
}) => {
  // if default behavior is opening a file, it blocks that to force other bahavior
  event.preventDefault()

  // isLongPress is to prevent executing onPress twice while a longpress
  // can happen if button is released quickly just after startPressTimer execution
  if (actionMenuVisible || disabled || isLongPress || isRenaming) return

  const currentTime = Date.now()
  const isDoubleClick =
    isDesktop && currentTime - lastClickTime < DOUBLECLICKDELAY

  if (isDoubleClick) {
    if (!isRenaming) {
      openLink(event)
    }
  } else {
    if (isDesktop || selectionModeActive) {
      toggle(event)
    } else {
      if (!isRenaming) {
        openLink(event)
      }
    }
  }

  setLastClickTime(currentTime)
}

export const useLongPress = ({
  actionMenuVisible,
  disabled,
  isRenaming,
  openLink,
  toggle
}) => {
  const timerId = useRef()
  const isLongPress = useRef(false)
  const [lastClickTime, setLastClickTime] = useState(0)
  const { isDesktop } = useBreakpoints()
  const { isSelectionBarVisible: selectionModeActive } = useSelectionContext()

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

  // if conditions are met, click is triggered after a certain amount of time
  const startPressTimerConditionnaly = e => {
    if (
      selectionModeActive ||
      e.button !== 0 // button 0 is left click or tap
    ) {
      return
    }

    startPressTimer(e)
  }

  return {
    handlers: {
      // first event triggered on Mobile when clicking an item
      onTouchStart: startPressTimer,
      // second event triggered on Mobile when dragging an item
      onTouchMove: clearTimeout(timerId.current),
      // third event triggered on Mobile when clicking an item
      onTouchEnd: clearTimeout(timerId.current),
      // first event triggered on Desktop, fourth on Mobile when clicking an item
      onMouseDown: flag('drive.virtualization.enabled') // should be something like `isDragging` instead. Using flag is too implicit
        ? undefined
        : startPressTimerConditionnaly,
      // second event triggered on Desktop, fifth on Mobile when clicking an item
      onMouseUp: clearTimeout(timerId.current),
      // third event triggered on Desktop, sixth on Mobile when clicking an item
      onClick: event =>
        handlePress({
          event,
          actionMenuVisible,
          disabled,
          selectionModeActive,
          isDesktop,
          isLongPress: isLongPress.current,
          isRenaming,
          openLink,
          lastClickTime,
          setLastClickTime,
          toggle
        })
    }
  }
}
