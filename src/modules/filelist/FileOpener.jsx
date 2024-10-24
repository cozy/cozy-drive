import Hammer from '@egjs/hammerjs'
import propagating from 'propagating-hammerjs'
import React, { useEffect, useRef } from 'react'

import styles from './fileopener.styl'
import { FileLink } from 'modules/navigation/components/FileLink'
import { useFileLink } from 'modules/navigation/hooks/useFileLink'

const getParentDiv = element => {
  if (element.nodeName.toLowerCase() === 'div') {
    return element
  }
  return getParentDiv(element.parentNode)
}

export const getParentLink = element => {
  if (!element) {
    return null
  }

  if (element.nodeName.toLowerCase() === 'a') {
    return element
  }

  return getParentLink(element.parentNode)
}

const enableTouchEvents = ev => {
  // remove event when you rename a file
  if (['INPUT', 'BUTTON'].indexOf(ev.target.nodeName) !== -1) {
    return false
  }

  const parentDiv = getParentDiv(ev.target)
  // remove event when it's the checkbox or the more button
  if (
    parentDiv.className.indexOf(styles['fil-content-file-select']) !== -1 ||
    parentDiv.className.indexOf(styles['fil-content-file-action']) !== -1
  ) {
    return false
  }

  // Check if the clicked element is a file path, in that case the FileOpener has nothing to handle
  if (ev.srcEvent.target.closest('[class^="fil-file-path"]')) return false

  return true
}

export function handlePress(
  ev,
  {
    actionMenuVisible,
    disabled,
    enableTouchEvents,
    selectionModeActive,
    isRenaming,
    openLink,
    toggle
  }
) {
  if (actionMenuVisible || disabled) return
  if (enableTouchEvents(ev)) {
    ev.preventDefault() // prevent a ghost click
    if (ev.type === 'press' || selectionModeActive) {
      ev.srcEvent.stopImmediatePropagation()
      toggle(ev)
    } else {
      ev.srcEvent.stopImmediatePropagation()
      if (!isRenaming) {
        openLink(ev.srcEvent)
      }
    }
  }
}

const FileOpener = ({
  file,
  disabled,
  actionMenuVisible,
  toggle,
  selectionModeActive,
  isRenaming,
  children
}) => {
  const rowRef = useRef()
  const { link, openLink } = useFileLink(file)

  useEffect(() => {
    if (!rowRef || !rowRef.current) return

    const gesturesHandler = propagating(new Hammer(rowRef.current))
    gesturesHandler.on('tap press singletap', ev =>
      handlePress(ev, {
        actionMenuVisible,
        disabled,
        enableTouchEvents,
        selectionModeActive,
        isRenaming,
        openLink,
        toggle
      })
    )

    return () => {
      gesturesHandler && gesturesHandler.destroy()
    }
  }, [
    actionMenuVisible,
    disabled,
    isRenaming,
    openLink,
    selectionModeActive,
    toggle
  ])

  const handleClick = ev => {
    ev.preventDefault()
  }

  return (
    <FileLink
      ref={rowRef}
      onClick={handleClick}
      link={link}
      className={`${styles['file-opener']} ${styles['file-opener__a']}`}
    >
      {children}
    </FileLink>
  )
}

export default FileOpener
