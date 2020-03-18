import React, { useRef, useEffect } from 'react'
import { useClient } from 'cozy-client'
import Hammer from 'hammerjs'
import { isMobileApp } from 'cozy-device-helper'
import cx from 'classnames'

import { enableTouchEvents } from './File'
import { generateFileUrl } from './generateFileUrl'
import styles from './fileopener.styl'

const FileOpener = ({
  file,
  children,
  disabled,
  actionMenuVisible,
  toggle,
  open,
  selectionModeActive,
  isFlatDomain,
  isActive
}) => {
  const linkRef = useRef(null)
  const client = useClient()
  const fileUrl = generateFileUrl({ client, isFlatDomain, file })
  const shouldOpenInANewTab = file.class === 'shortcut' && !isMobileApp()

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
              if (!shouldOpenInANewTab) {
                open(ev.srcEvent, file)
              }
            }
          }
        })
      }
      return () => gesturesHandler && gesturesHandler.destroy()
    },
    [linkRef.current]
  )

  if (shouldOpenInANewTab && isActive) {
    return (
      <a
        href={fileUrl}
        rel="noopener noreferrer"
        target="_blank"
        className={cx(styles['file-opener'], styles['file-opener__a'])}
        ref={linkRef}
      >
        {children}
      </a>
    )
  } else {
    return (
      <span className={styles['file-opener']} ref={linkRef} id={file.id}>
        {children}
      </span>
    )
  }
}

export default FileOpener
