import React, { useRef, useEffect } from 'react'
import { useClient } from 'cozy-client'
import Hammer from 'hammerjs'
import { isMobileApp } from 'cozy-device-helper'

import { enableTouchEvents } from './File'
import { generateFileUrl } from './generateFileUrl'

const FileOpener = ({
  file,
  children,
  disabled,
  actionMenuVisible,
  toggle,
  open,
  selectionModeActive,
  isFlatDomain
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

  if (shouldOpenInANewTab) {
    return (
      <a
        href={fileUrl}
        target="_blank"
        style={{
          width: '100%',
          display: 'contents',
          textDecoration: 'none',
          color: 'var(--coolGrey)',
          alignItems: 'center'
        }}
        ref={linkRef}
      >
        {children}
      </a>
    )
  } else {
    return (
      <span style={{ display: 'contents' }} ref={linkRef} id={file.id}>
        {children}
      </span>
    )
  }
}

export default FileOpener
