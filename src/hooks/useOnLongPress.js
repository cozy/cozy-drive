import { useRef, useState } from 'react'

import flag from 'cozy-flags'

export const handlePress = ({
  event,
  actionMenuVisible,
  disabled,
  selectionModeActive,
  isDesktop,
  isLongPress,
  isRenaming,
  openLink,
  toggle
}) => {
  console.info(' ')
  console.info('🟢 handlePress')
  console.info(' ')

  // if default behavior is opening a file, it blocks that to force other bahavior
  event.preventDefault()

  // isLongPress is to prevent executing onPress twice while a longpress
  // can happen if button is released quickly just after startPressTimer execution
  if (actionMenuVisible || disabled || isLongPress || isRenaming) return

  if (isDesktop || selectionModeActive) {
    toggle(event)
  } else {
    if (!isRenaming) {
      openLink(event)
    }
  }
}

export const useLongPress = ({
  selectionModeActive,
  isDesktop,
  actionMenuVisible,
  disabled,
  isRenaming,
  openLink,
  toggle
}) => {
  const timerId = useRef()
  const isLongPress = useRef(false)
  const isDoubleClick = useRef(false)
  const [clickCount, setClickCount] = useState(0)
  const clickTimerRef = useRef(null)
  const [lastClickTime, setLastClickTime] = useState(0)
  const doubleClickDelay = 400

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

  const handleClick = event => {
    event.persist()
    event.preventDefault()

    console.info(' ')
    console.info('🟡 handleClick')

    // setClickCount(clickCount + 1)
    // if (clickCount === 0) {
    //   clickTimerRef.current = setTimeout(() => {
    //     console.log('simple click')
    //     setClickCount(0)

    //     if (!isRenaming) {
    //       toggle(event)
    //     }
    //   }, doubleClickDelay)
    // } else {
    //   clearTimeout(clickTimerRef.current)
    //   console.log('double click')
    //   setClickCount(0)

    //   if (!isRenaming) {
    //     openLink(event)
    //   }
    // }

    const currentTime = Date.now()
    if (currentTime - lastClickTime < doubleClickDelay) {
      console.info('double click')
      if (!isRenaming) {
        openLink(event)
      }
    } else {
      console.info('simple click')

      if (!isRenaming) {
        toggle(event)
      }
    }
    setLastClickTime(currentTime)

    // handlePress({
    //   event,
    //   actionMenuVisible,
    //   disabled,
    //   selectionModeActive,
    //   isDesktop,
    //   isLongPress: isLongPress.current,
    //   isRenaming,
    //   openLink,
    //   toggle
    // })
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
      onMouseUp: () => {
        console.info(' ')
        console.info('onMouseUp')
        clearTimeout(timerId.current)
      },
      // third event triggered on Desktop, sixth on Mobile when clicking an item
      onClick: handleClick,
      onDoubleClick: event => {
        console.info(' ')
        console.info('🔵 onDoubleClick')

        // handlePress({
        //   event,
        //   actionMenuVisible,
        //   disabled,
        //   selectionModeActive,
        //   isDesktop,
        //   isLongPress: isLongPress.current,
        //   isRenaming,
        //   openLink,
        //   toggle
        // })
      }
    }
  }
}
