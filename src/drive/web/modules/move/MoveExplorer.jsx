import React from 'react'
import PropTypes from 'prop-types'

import FileList from 'drive/web/modules/filelist/FileList'
import fileListStyles from 'drive/styles/filelist'

const MoveExplorer = ({ children }) => (
  <FileList canSort={false} fileActions={null} withSelectionCheckbox={false}>
    <div className={fileListStyles['fil-content-body']}>{children}</div>
  </FileList>
)

MoveExplorer.propTypes = {
  children: PropTypes.node
}

export default MoveExplorer
