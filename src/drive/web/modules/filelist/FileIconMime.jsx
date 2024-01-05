import React from 'react'
import PropTypes from 'prop-types'

import { isDirectory } from 'cozy-client/dist/models/file'
import { Icon } from 'cozy-ui/transpiled/react'
import { isEncryptedFolder } from 'lib/encryption'
import getMimeTypeIcon from 'lib/getMimeTypeIcon'

const FileIcon = ({ file, size = 32, isEncrypted = false }) => {
  const isDir = isDirectory(file)
  const isDirEncrypted = isEncrypted || (isDirectory && isEncryptedFolder(file)) // use file.ref + file.type

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
    type: PropTypes.string,
    mime: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  size: PropTypes.number
}

export default FileIcon
