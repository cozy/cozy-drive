import React from 'react'
import PropTypes from 'prop-types'

import fileListStyles from 'drive/styles/filelist'
import FileListHeader, {
  MobileFileListHeader
} from 'drive/web/modules/filelist/FileListHeader'

const MoveExplorer = ({ children }) => (
  <div className={fileListStyles['fil-content-table']} role="table">
    <MobileFileListHeader canSort={false} />
    <FileListHeader canSort={false} />
    <div className={fileListStyles['fil-content-body']}>
      {/*Missing FileListBody providing the add folder component */}
      {children}
    </div>
  </div>
)

MoveExplorer.propTypes = {
  children: PropTypes.node
}

export default MoveExplorer
