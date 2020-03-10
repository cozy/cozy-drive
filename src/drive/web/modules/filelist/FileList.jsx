import React from 'react'

import FileListHeader, {
  MobileFileListHeader
} from 'drive/web/modules/filelist/FileListHeader'
import FileListBody from 'drive/web/modules/filelist/FileListBody'

import styles from 'drive/styles/filelist.styl'

export const FileListv2 = ({ children }) => (
  <div className={styles['fil-content-table']} role="table">
    {children}
  </div>
)

const FileList = ({
  canSort,
  fileActions,
  withSelectionCheckbox = true,
  children,
  files,
  fileCount,
  fetchMoreFiles,
  displayedFolder,
  onFolderOpen,
  onFileOpen,
  withFilePath,
  withSharedBadge,
  isRenaming,
  renamingFile
}) => (
  <FileListv2>
    <MobileFileListHeader canSort={canSort} />
    <FileListHeader canSort={canSort} />
    {React.Children.count(children) > 0 ? (
      children
    ) : (
      <FileListBody
        fileActions={fileActions}
        withSelectionCheckbox={withSelectionCheckbox}
        files={files}
        fileCount={fileCount}
        fetchMoreFiles={fetchMoreFiles}
        displayedFolder={displayedFolder}
        onFolderOpen={onFolderOpen}
        onFileOpen={onFileOpen}
        withFilePath={withFilePath}
        withSharedBadge={withSharedBadge}
        isRenaming={isRenaming}
        renamingFile={renamingFile}
      />
    )}
  </FileListv2>
)

export default FileList
