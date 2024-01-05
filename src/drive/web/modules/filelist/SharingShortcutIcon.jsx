import React from 'react'

import Icon from 'cozy-ui/transpiled/react/Icon'
import {
  getSharingShortcutTargetMime,
  getSharingShortcutTargetDoctype
} from 'cozy-client/dist/models/file'

import getMimeTypeIcon from 'lib/getMimeTypeIcon'
import { DOCTYPE_FILES } from 'lib/doctypes'
import FileIconShortcut from 'drive/web/modules/filelist/FileIconShortcut'

const SharingShortcutIcon = ({ file, size }) => {
  const targetMimeType = getSharingShortcutTargetMime(file)
  const targetDoctype = getSharingShortcutTargetDoctype(file)
  const isShortcut = targetMimeType === 'application/internet-shortcut'
  const targetIsDirectory =
    targetMimeType === '' && targetDoctype === DOCTYPE_FILES

  return isShortcut ? (
    <FileIconShortcut file={file} size={size} />
  ) : (
    <Icon
      icon={getMimeTypeIcon(targetIsDirectory, file.name, targetMimeType)}
      size={size}
    />
  )
}

export { SharingShortcutIcon }
