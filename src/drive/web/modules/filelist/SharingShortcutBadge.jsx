import React from 'react'
import get from 'lodash/get'
import Icon from 'cozy-ui/transpiled/react/Icon'
import Badge from 'cozy-ui/transpiled/react/Badge'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'
import { DOCTYPE_FILES } from 'drive/lib/doctypes'
import FileIconShortcut from 'drive/web/modules/filelist/FileIconShortcut'

const SharingShortcutBadge = ({ file, size }) => {
  const targetMimeType = get(file, 'metadata.target.mime')
  const targetDoctype = get(file, 'metadata.target._type')
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

const withNewStatusBadge = WrappedComponent => {
  const ComponentWithNewStatusBadge = props => {
    const { file } = props
    const isNewSharingShortcut = get(file, 'metadata.sharing.status') === 'new'

    return isNewSharingShortcut ? (
      <Badge variant="dot" color="error">
        <WrappedComponent {...props} />
      </Badge>
    ) : (
      <WrappedComponent {...props} />
    )
  }

  return ComponentWithNewStatusBadge
}

export default withNewStatusBadge(SharingShortcutBadge)
