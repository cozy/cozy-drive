import { useRef } from 'react'
import { useDispatch } from 'react-redux'

import flag from 'cozy-flags'
import { clearNewItems } from '@/modules/upload'

export default function useLongPress({ onPress, selectionModeActive }) {
  const timerRef = useRef()
  const isLongPress = useRef()
  const dispatch = useDispatch()

  // used to create the longpress, i.e. delay on click
  function startPressTimer(e) {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      onPress(e, 'press')
    }, 250)
  }

  // first event triggered on Desktop when clicking an item
  // if conditions are met, click is triggered after a certain amount of time
  function handleOnMouseDown(e) {
    // button 0 is left click

    // Clear any new items that could be in the upload state
    dispatch(clearNewItems())

    if (
      selectionModeActive ||
      e.button !== 0 ||
      flag('drive.virtualization.enabled') // should be something like `isDragging` instead. Using flag is too implicit
    ) {
      return
    }

    // We need to persist event in React <= 16
    e.persist()
    startPressTimer(e)
  }

  // second event triggered on Desktop when clicking an item
  function handleOnMouseUp() {
    clearTimeout(timerRef.current)
  }

  // third event triggered on Desktop when clicking an item
  function handleOnClick(e) {
    e.preventDefault()
    // if it's a longpress, do nothing
    if (isLongPress.current) {
      return
    }

    // if it's a simple short press, do clicking
    onPress(e, 'click')
  }

  function handleOnTouchStart(e) {
    // We need to persist event in React <= 16
    e.persist()
    startPressTimer(e)
  }

  function handleOnTouchEnd() {
    clearTimeout(timerRef.current)
  }

  return {
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd
    }
  }
}
