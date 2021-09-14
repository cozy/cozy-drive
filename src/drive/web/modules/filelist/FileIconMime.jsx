import React from 'react'
import PropTypes from 'prop-types'

import { isDirectory } from 'cozy-client/dist/models/file'
import Icon from 'cozy-ui/transpiled/react/Icon'
import { isEncryptedDir } from 'drive/lib/encryption'
import EncryptedFolderIcon from 'drive/web/modules/views/Folder/EncryptedFolderIcon'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'

const FileIcon = ({ file, size = 32 }) => {
  const isDir = isDirectory(file)
  const isEncrypted = isDirectory && isEncryptedDir(file)
  if (isEncrypted) {
    return <EncryptedFolderIcon />
  }
  return (
    <Icon icon={getMimeTypeIcon(isDir, file.name, file.mime)} size={size} />
  )
}

FileIcon.propTypes = {
  file: PropTypes.shape({
    class: PropTypes.string,
    mime: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  size: PropTypes.number
}

export default FileIcon
