import React from 'react'
import PropTypes from 'prop-types'

import { FileListv2 } from 'drive/web/modules/filelist/FileList'
import FileListHeader from 'drive/web/modules/filelist/FileListHeader'
import MobileFileListHeader from 'drive/web/modules/filelist/MobileFileListHeader'
import { ConnectedFileListBodyV2 as FileListBodyV2 } from 'drive/web/modules/filelist/FileListBody'

const Explorer = ({ children }) => (
  <FileListv2>
    <>
      <MobileFileListHeader folderId={null} canSort={false} />
      <FileListHeader folderId={null} canSort={false} />
    </>
    <FileListBodyV2 selectionModeActive={false}>{children}</FileListBodyV2>
  </FileListv2>
)

Explorer.propTypes = {
  children: PropTypes.node
}

export default Explorer
