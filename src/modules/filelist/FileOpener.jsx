import React, { useRef } from 'react'

import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'

import styles from './fileopener.styl'

import { useLongPress } from '@/hooks/useOnLongPress'
import { FileLink } from '@/modules/navigation/components/FileLink'
import { useFileLink } from '@/modules/navigation/hooks/useFileLink'

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
    isDesktop,
    actionMenuVisible,
    disabled,
    isRenaming,
    openLink,
    toggle
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
