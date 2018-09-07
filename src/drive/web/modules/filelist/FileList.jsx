import React from 'react'

import FileListHeader, {
  MobileFileListHeader
} from 'drive/web/modules/filelist/FileListHeader'
import FileListBody from 'drive/web/modules/filelist/FileListBody'

import styles from 'drive/styles/filelist'

const FileList = ({
  canSort,
  fileActions,
  withSelectionCheckbox = true,
  ...rest
}) => (
  <div className={styles['fil-content-table']} role="table">
    <MobileFileListHeader canSort={canSort} />
    <FileListHeader canSort={canSort} />
    <FileListBody
      fileActions={fileActions}
      withSelectionCheckbox={withSelectionCheckbox}
      {...rest}
    />
  </div>
)

export default FileList
