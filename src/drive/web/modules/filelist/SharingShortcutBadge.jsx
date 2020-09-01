import React from 'react'
import get from 'lodash/get'
import Icon from 'cozy-ui/transpiled/react/Icon'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'
import { isDirectory } from 'drive/web/modules/drive/files'
import FileIconShortcut from 'drive/web/modules/filelist/FileIconShortcut'

const SharingShortcutBadge = ({ file, size }) => {
  const actualFileMime = get(file, 'metadata.target.mime')
  const isShortcut = actualFileMime === 'application/internet-shortcut'

  return isShortcut ? (
    <FileIconShortcut file={file} size={size} />
  ) : (
    <Icon
      icon={getMimeTypeIcon(isDirectory(file), file.name, actualFileMime)}
      size={size}
    />
  )
}

export default SharingShortcutBadge
