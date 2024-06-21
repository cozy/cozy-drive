import React, { ReactNode } from 'react'

import { Table } from 'cozy-ui/transpiled/react/deprecated/Table'

import FileListBody from 'modules/filelist/FileListBody'
import { FileListHeader } from 'modules/filelist/FileListHeader'

interface FolderPickerContentExplorerProps {
  children: ReactNode
}

const FolderPickerContentExplorer: React.FC<
  FolderPickerContentExplorerProps
> = ({ children }) => (
  <Table role="table">
    <FileListHeader folderId={null} canSort={false} />
    <FileListBody className="u-ov-visible">{children}</FileListBody>
  </Table>
)

export { FolderPickerContentExplorer }
