import React, { useRef } from 'react'

import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import styles from './fileopener.styl'

import useLongPress from '@/hooks/useOnLongPress'
import { FileLink } from '@/modules/navigation/components/FileLink'
import { useFileLink } from '@/modules/navigation/hooks/useFileLink'

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
  // Check if the clicked element is an input to avoid disturbing events while renaming
  if (['INPUT', 'BUTTON'].indexOf(ev.target.nodeName) !== -1) {
    return false
  }

  // Check if the clicked element is a file path because in that case the FileOpener has nothing to handle
  // and we just want to follow the link from the file path
  const parentLink = getParentLink(ev.target)
  if (parentLink.className.indexOf('fil-file-path') !== -1) {
    return false
  }

  return true
}

export function handlePress(
  ev,
  type,
  {
    actionMenuVisible,
    disabled,
    selectionModeActive,
    isDesktop,
    isRenaming,
    openLink,
    toggle
  }
) {
  if (actionMenuVisible || disabled) return

  if (enableTouchEvents(ev)) {
    if (type === 'press' || selectionModeActive || isDesktop) {
      toggle(ev)
    } else {
      if (!isRenaming) {
        openLink(ev)
      }
    }
  }
}

const FileOpener = ({
  file,
  toggle,
  actionMenuVisible,
  disabled,
  selectionModeActive,
  isRenaming,
  children
}) => {
  const { isDesktop } = useBreakpoints()
  const rowRef = useRef()
  const { link, openLink } = useFileLink(file)
  const { handlers: longPressHandlers } = useLongPress({
    selectionModeActive,
    onPress: (ev, type) =>
      handlePress(ev, type, {
        actionMenuVisible,
        disabled,
        selectionModeActive,
        isDesktop,
        isRenaming,
        openLink,
        toggle
      })
  })

  return (
    <FileLink
      ref={rowRef}
      link={link}
      className={`${styles['file-opener']} ${styles['file-opener__a']}`}
      {...longPressHandlers}
    >
      {children}
    </FileLink>
  )
}

export default FileOpener
