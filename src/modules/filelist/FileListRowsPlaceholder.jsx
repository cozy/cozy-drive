import React from 'react'
import PropTypes from 'prop-types'
import FilePlaceholder from 'modules/filelist/FilePlaceholder'

const FileListPlaceholder = ({ rows }) => (
  <div>
    {[...new Array(rows)].map((value, index) => (
      <FilePlaceholder index={index} key={`key_file_placeholder_${index}`} />
    ))}
  </div>
)

FileListPlaceholder.propTypes = {
  rows: PropTypes.number
}

FileListPlaceholder.defaultProps = {
  rows: 8
}

export default FileListPlaceholder
