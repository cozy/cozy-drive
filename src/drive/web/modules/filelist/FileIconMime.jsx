import React from 'react'
import PropTypes from 'prop-types'

import { isDirectory } from 'cozy-client/dist/models/file'
import { Icon } from 'cozy-ui/transpiled/react'
import { isEncryptedFolder } from 'drive/lib/encryption'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'

const FileIcon = ({ file, size = 32, isEncrypted = false }) => {
  const isDir = isDirectory(file)
  const isDirEncrypted = isEncrypted || (isDirectory && isEncryptedFolder(file))

  return (
    <Icon
      icon={getMimeTypeIcon(isDir, file.name, file.mime, {
        isEncrypted: isDirEncrypted
      })}
      size={size}
    />
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
