import React from 'react'
import PropTypes from 'prop-types'
import FilePlaceholder from './FilePlaceholder'

const FileListPlaceholder = ({ rows }) => (
  <div>
    {[...new Array(rows)].map((value, index) => (
      <FilePlaceholder index={index} />
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
