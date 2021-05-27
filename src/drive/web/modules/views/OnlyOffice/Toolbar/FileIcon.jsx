import React from 'react'
import PropTypes from 'prop-types'

import Icon from 'cozy-ui/transpiled/react/Icon'

import { makeOnlyOfficeIconByClass } from 'drive/web/modules/views/OnlyOffice/helpers'

const FileIcon = ({ fileClass }) => {
  return (
    <Icon
      className="u-ml-half"
      icon={makeOnlyOfficeIconByClass(fileClass)}
      size={32}
    />
  )
}

FileIcon.propTypes = {
  fileClass: PropTypes.string.isRequired
}

export default FileIcon
