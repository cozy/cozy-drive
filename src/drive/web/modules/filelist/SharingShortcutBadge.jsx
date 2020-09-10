import React from 'react'
import get from 'lodash/get'
import Icon from 'cozy-ui/transpiled/react/Icon'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'
import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import FileIconShortcut from 'drive/web/modules/filelist/FileIconShortcut'

const SharingShortcutBadge = ({ file, size }) => {
  const actualFileMime = get(file, 'metadata.target.mime')
  const doctype = get(file, 'metadata.target._type')
  const isShortcut = actualFileMime === 'application/internet-shortcut'
  const isDirectory = actualFileMime === '' && doctype === DOCTYPE_FILES

  return isShortcut ? (
    <FileIconShortcut file={file} size={size} />
  ) : (
    <Icon
      icon={getMimeTypeIcon(isDirectory, file.name, actualFileMime)}
      size={size}
    />
  )
}

export default SharingShortcutBadge
