import Hammer from '@egjs/hammerjs'
import propagating from 'propagating-hammerjs'
import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { models } from 'cozy-client'

import styles from './fileopener.styl'
import { makeOnlyOfficeFileRoute } from 'modules/views/OnlyOffice/helpers'

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

const FileOpener = ({
  file,
  disabled,
  actionMenuVisible,
  toggle,
  open,
  selectionModeActive,
  isRenaming,
  children
}) => {
  const rowRef = useRef()
  const { pathname } = useLocation()

  useEffect(() => {
    if (!rowRef || !rowRef.current) return

    const gesturesHandler = propagating(new Hammer(rowRef.current))

    gesturesHandler.on('tap press singletap', ev => {
      if (actionMenuVisible || disabled) return
      if (enableTouchEvents(ev)) {
        ev.preventDefault() // prevent a ghost click
        if (ev.type === 'press' || selectionModeActive) {
          ev.srcEvent.stopImmediatePropagation()
          toggle(ev.srcEvent)
        } else {
          ev.srcEvent.stopImmediatePropagation()
          if (!isRenaming) open(ev.srcEvent, file)
        }
      }
    })

    return () => {
      gesturesHandler && gesturesHandler.destroy()
    }
  }, [
    rowRef,
    file,
    disabled,
    actionMenuVisible,
    toggle,
    open,
    selectionModeActive,
    isRenaming
  ])

  if (models.file.shouldBeOpenedByOnlyOffice(file)) {
    return (
      <a
        data-testid="onlyoffice-link"
        className={`${styles['file-opener']} ${styles['file-opener__a']}`}
        ref={rowRef}
        id={file.id}
        href={makeOnlyOfficeFileRoute(file.id, {
          withoutRouter: true,
          fromPathname: pathname
        })}
        onClick={ev => {
          ev.preventDefault()
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <span
      data-testid="not-onlyoffice-span"
      className={styles['file-opener']}
      ref={rowRef}
      id={file.id}
    >
      {children}
    </span>
  )
}

export default FileOpener
