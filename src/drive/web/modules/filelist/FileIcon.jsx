import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'cozy-ui/transpiled/react'
import getMimeTypeIcon from 'drive/lib/getMimeTypeIcon'
import { isDirectory } from 'drive/web/modules/drive/files'
import FileIconShortcut from './FileIconShortCut'

const FileIcon = ({ file, size = 32 }) => {
  if (file.class === 'shortcut') {
    return <FileIconShortcut file={file} size={size} />
  }
  return (
    <Icon
      icon={getMimeTypeIcon(isDirectory(file), file.name, file.mime)}
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
