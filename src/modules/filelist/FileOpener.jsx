import React, { useRef } from 'react'

import styles from './fileopener.styl'

import { useLongPress } from '@/hooks/useOnLongPress'
import { FileLink } from '@/modules/navigation/components/FileLink'
import { useFileLink } from '@/modules/navigation/hooks/useFileLink'

const FileOpener = ({ file, toggle, disabled, isRenaming, children }) => {
  const rowRef = useRef()
  const { link, openLink } = useFileLink(file)
  const handlers = useLongPress({
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
      {...handlers}
    >
      {children}
    </FileLink>
  )
}

export default FileOpener
