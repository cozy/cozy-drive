import React, { useRef } from 'react'
import get from 'lodash/get'
import { generateWebLink, withClient, useCapabilities } from 'cozy-client'
import Hammer from 'hammerjs'

import { enableTouchEvents } from './File'
import { useEffect } from 'react'

const FileOpener = ({
  client,
  file,
  children,
  disabled,
  actionMenuVisible,
  toggle,
  open,
  selectionModeActive
}) => {
  const linkRef = useRef(null)
  const capabilities = useCapabilities(client)
  const isFlatDomain = get(
    capabilities,
    'capabilities.attributes.flat_subdomains'
  )
  const currentURL = new URL(window.location)
  let webLink = ''
  if (currentURL.pathname === '/public') {
    webLink = generateWebLink({
      cozyUrl: client.getStackClient().uri,
      pathname: '/public',
      slug: 'drive',
      hash: `external/${file.id}`,
      searchParams: currentURL.searchParams,
      subDomainType: isFlatDomain ? 'flat' : 'nested'
    })
  } else {
    webLink = generateWebLink({
      cozyUrl: client.getStackClient().uri,
      pathname: '/',
      slug: 'drive',
      hash: `external/${file.id}`,
      subDomainType: isFlatDomain ? 'flat' : 'nested'
    })
  }

  useEffect(
    () => {
      const gesturesHandler = new Hammer.Manager(linkRef.current)
      if (linkRef.current !== null) {
        if (file.class === 'shortcut') {
          gesturesHandler.add(new Hammer.Tap({ event: 'singletap' }))

          gesturesHandler.on('singletap', ev => {
            ev.srcEvent.stopImmediatePropagation()
          })
        } else {
          gesturesHandler.add(new Hammer.Tap({ event: 'singletap' }))
          gesturesHandler.add(new Hammer.Press({ event: 'onpress' }))
          gesturesHandler.on('onpress singletap', ev => {
            if (actionMenuVisible || disabled) return
            //don't read this value on the didMount... prefer when the listener is called
            if (enableTouchEvents(ev)) {
              ev.preventDefault() // prevent a ghost click
              if (ev.type === 'onpress' || selectionModeActive) {
                ev.srcEvent.stopImmediatePropagation()
                toggle(ev.srcEvent)
              } else {
                ev.srcEvent.stopImmediatePropagation()
                open(ev.srcEvent, file)
              }
            }
          })
        }
      }
      return () => gesturesHandler.destroy()
    },
    [linkRef.current]
  )

  if (file.class === 'shortcut') {
    return (
      <a
        href={webLink}
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
      <span style={{ display: 'contents' }} ref={linkRef}>
        {children}
      </span>
    )
  }
}

export default withClient(FileOpener)
