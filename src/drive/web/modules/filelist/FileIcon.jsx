import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'cozy-ui/react'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'
import { isDirectory } from 'drive/web/modules/drive/files'

const FileIcon = ({ file }) => {
  return (
    <Icon
      icon={getMimeTypeIcon(isDirectory(file), file.name, file.mime)}
      size={32}
    />
  )
}

FileIcon.propTypes = {
  file: PropTypes.shape({
    class: PropTypes.string,
    mime: PropTypes.string,
    name: PropTypes.string
  }).isRequired
}

export default FileIcon
