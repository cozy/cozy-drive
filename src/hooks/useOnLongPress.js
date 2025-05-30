import { useRef } from 'react'

export default function useLongPress({ onPress, selectionModeActive }) {
  const timerRef = useRef()
  const isLongPress = useRef()

  function startPressTimer(e) {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      onPress(e, 'press')
    }, 250)
  }
  function handleOnClick(e) {
    e.preventDefault()
    if (isLongPress.current) {
      return
    }

    onPress(e, 'click')
  }
  function handleOnMouseDown(e) {
    if (selectionModeActive) {
      return
    }
    // We need to persist event in React <= 16
    e.persist()
    startPressTimer(e)
  }
  function handleOnMouseUp() {
    clearTimeout(timerRef.current)
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
