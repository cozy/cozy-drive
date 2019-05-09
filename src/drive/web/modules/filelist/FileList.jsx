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
  <div className={styles['fil-content-table']} role="table">
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
  </div>
)

export default FileList
