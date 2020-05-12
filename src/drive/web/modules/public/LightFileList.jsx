import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import FileList from 'drive/web/modules/filelist/FileList'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'
import { mapDispatchToProps } from './Actions'
import { isRenaming, getRenamingFile } from 'drive/web/modules/drive/rename'

const LightFileList = ({
  actions,
  onFileOpen,
  onFolderOpen,
  isRenaming,
  renamingFile,
  fileListProps
}) => (
  <>
    <SelectionBar actions={actions} />
    <FileList
      onFileOpen={onFileOpen}
      onFolderOpen={onFolderOpen}
      withSelectionCheckbox={true}
      fileActions={actions}
      isRenaming={isRenaming}
      renamingFile={renamingFile}
      {...fileListProps}
    />
  </>
)

const mapStateToProps = state => ({
  isRenaming: isRenaming(state),
  renamingFile: getRenamingFile(state)
})

export default withRouter(
  //router is used in mapDispatchToProps
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(LightFileList)
)
