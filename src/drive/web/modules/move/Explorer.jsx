import React from 'react'
import PropTypes from 'prop-types'

import { FileList } from 'drive/web/modules/filelist/FileList'
import FileListHeader from 'drive/web/modules/filelist/FileListHeader'
import MobileFileListHeader from 'drive/web/modules/filelist/MobileFileListHeader'
import { ConnectedFileListBody as FileListBody } from 'drive/web/modules/filelist/FileListBody'

const Explorer = ({ children }) => (
  <FileList>
    <>
      <MobileFileListHeader folderId={null} canSort={false} />
      <FileListHeader folderId={null} canSort={false} />
    </>
    <FileListBody selectionModeActive={false}>{children}</FileListBody>
  </FileList>
)

Explorer.propTypes = {
  children: PropTypes.node
}

export default Explorer
