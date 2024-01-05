import React from 'react'
import PropTypes from 'prop-types'

import { Table } from 'cozy-ui/transpiled/react/Table'

import FileListHeader from 'modules/filelist/FileListHeader'
import MobileFileListHeader from 'modules/filelist/MobileFileListHeader'
import FileListBody from 'modules/filelist/FileListBody'

const Explorer = ({ children }) => (
  <Table role="table">
    <>
      <MobileFileListHeader folderId={null} canSort={false} />
      <FileListHeader folderId={null} canSort={false} />
    </>
    <FileListBody className="u-ov-visible" selectionModeActive={false}>
      {children}
    </FileListBody>
  </Table>
)

Explorer.propTypes = {
  children: PropTypes.node
}

export default Explorer
