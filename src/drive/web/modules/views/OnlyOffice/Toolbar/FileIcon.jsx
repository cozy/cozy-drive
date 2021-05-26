import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'cozy-ui/transpiled/react/Icon'
import FileTypeSheetIcon from 'cozy-ui/transpiled/react/Icons/FileTypeSheet'
import FileTypeSlideIcon from 'cozy-ui/transpiled/react/Icons/FileTypeSlide'
import FileTypeTextIcon from 'cozy-ui/transpiled/react/Icons/FileTypeText'

const FileTypeIcon = {
  spreadsheet: FileTypeSheetIcon,
  slide: FileTypeSlideIcon,
  text: FileTypeTextIcon
}

const FileIcon = ({ fileClass }) => {
  return <Icon className="u-ml-half" icon={FileTypeIcon[fileClass]} size={32} />
}

FileIcon.propTypes = {
  fileClass: PropTypes.string.isRequired
}

export default FileIcon
