import React, { useRef } from 'react'

import styles from './fileopener.styl'

import { useLongPress } from '@/hooks/useOnLongPress'
import { FileLink } from '@/modules/navigation/components/FileLink'
import { useFileLink } from '@/modules/navigation/hooks/useFileLink'
import { useShell } from '@/hooks/useShell'

const FileOpener = ({
  file,
  toggle,
  disabled,
  isRenaming,
  onInteractWithFile,
  children
}) => {
  const rowRef = useRef()
  const { link, openLink } = useFileLink(file)
  const { runsInShell, selectedFile, openFileInParent } = useShell();
  const handlers = useLongPress({
    file,
    disabled,
    isRenaming,
    openLink,
    toggle,
    onInteractWithFile
  })

  const fileExt = file.name.split(".")[file.name.split(".").length - 1];

  if (runsInShell && file.type === "file") {
    if (fileExt == "docs-note") {
      return (
        <div
          onClick={() => {
            openFileInParent(file)
          }}
          className={`${styles['file-opener']} ${styles['file-opener__a']}`}
        >
          {children}
        </div>
      )
    }
    else {
      link.openInNewTab = true;
    }
  }

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
