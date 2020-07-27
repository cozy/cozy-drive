import React, { useRef, useEffect } from 'react'
import Hammer from 'hammerjs'

import { enableTouchEvents } from './File'
import styles from './fileopener.styl'

const FileOpener = ({
  file,
  children,
  disabled,
  actionMenuVisible,
  toggle,
  open,
  selectionModeActive,
  isActive
}) => {
  const linkRef = useRef(null)

  useEffect(
    () => {
      let gesturesHandler = null
      if (linkRef.current !== null) {
        gesturesHandler = new Hammer.Manager(linkRef.current)
        gesturesHandler.add(new Hammer.Tap({ event: 'singletap' }))
        gesturesHandler.add(new Hammer.Press({ event: 'onpress' }))
        gesturesHandler.on('onpress singletap', ev => {
          if (actionMenuVisible || disabled) return
          if (enableTouchEvents(ev)) {
            ev.preventDefault() // prevent a ghost click
            if (ev.type === 'onpress' || selectionModeActive) {
              ev.srcEvent.stopImmediatePropagation()
              toggle(ev.srcEvent)
            } else {
              ev.srcEvent.stopImmediatePropagation()
              if (isActive) open(ev.srcEvent, file)
            }
          }
        })
      }
      return () => gesturesHandler && gesturesHandler.destroy()
    },
    [
      linkRef.current,
      selectionModeActive,
      actionMenuVisible,
      disabled,
      isActive
    ]
  )

  return (
    <span className={styles['file-opener']} ref={linkRef} id={file.id}>
      {children}
    </span>
  )
}

export default FileOpener
