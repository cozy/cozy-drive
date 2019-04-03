import React from 'react'
import PropTypes from 'prop-types'

import FileList from 'drive/web/modules/filelist/FileList'
import fileListStyles from 'drive/styles/filelist'

const Explorer = ({ children }) => (
  <FileList canSort={false} fileActions={null} withSelectionCheckbox={false}>
    <div
      data-test-id="fil-content-modal"
      className={fileListStyles['fil-content-body']}
    >
      {children}
    </div>
  </FileList>
)

Explorer.propTypes = {
  children: PropTypes.node
}

export default Explorer
