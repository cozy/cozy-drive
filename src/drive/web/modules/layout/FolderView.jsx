/* global __TARGET__ */
import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { ModalManager } from 'react-cozy-helpers'

import { ROOT_DIR_ID } from 'drive/constants/config'

import MediaBackupProgression from 'drive/mobile/modules/mediaBackup/MediaBackupProgression'
import RatingModal from 'drive/mobile/modules/settings/RatingModal'
import FirstUploadModal from 'drive/mobile/modules/mediaBackup/FirstUploadModal'

import FileList from 'drive/web/modules/filelist/FileList'
import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'
import Dropzone from 'drive/web/modules/upload/Dropzone'
import AsyncBoundary from 'drive/web/modules/navigation/AsyncBoundary'
import { getFolderIdFromRoute } from 'drive/web/modules/navigation/duck'
import Main from './Main'
import Topbar from './Topbar'

class FolderView extends Component {
  render() {
    const { children, isTrashContext } = this.props
    const {
      displayedFolder,
      files,
      actions,
      Toolbar,
      canSort,
      canDrop,
      canUpload,
      canCreateFolder
    } = this.props

    const nothingToDo = isTrashContext && files.length === 0
    const folderId = getFolderIdFromRoute(
      this.props.location,
      this.props.params
    )
    const isRootfolder = folderId === ROOT_DIR_ID

    return (
      <Main>
        <Topbar>
          <Breadcrumb onFolderOpen={this.props.onFolderOpen} />
          <AsyncBoundary>
            {({ isLoading, isInError }) => (
              <Toolbar
                folderId={folderId}
                canUpload={canUpload}
                canCreateFolder={canCreateFolder}
                disabled={isInError || isLoading || nothingToDo}
              />
            )}
          </AsyncBoundary>
        </Topbar>
        <Dropzone
          role="main"
          disabled={__TARGET__ === 'mobile' || !canDrop}
          displayedFolder={displayedFolder}
        >
          {__TARGET__ === 'mobile' && (
            <div>
              {isRootfolder && <MediaBackupProgression />}
              <FirstUploadModal />
              <RatingModal />
            </div>
          )}
          <SelectionBar actions={actions.selection} />
          <FileList
            canSort={canSort}
            fileActions={actions.selection}
            files={this.props.files}
            fileCount={this.props.fileCount}
            fetchMoreFiles={this.props.fetchMoreFiles}
            displayedFolder={this.props.displayedFolder}
            onFolderOpen={this.props.onFolderOpen}
            onFileOpen={this.props.onFileOpen}
            withFilePath={this.props.withFilePath}
            withSharedBadge={this.props.withSharedBadge}
            isRenaming={this.props.isRenaming}
            renamingFile={this.props.renamingFile}
          />
          {this.renderViewer(children)}
        </Dropzone>
        <ModalManager />
      </Main>
    )
  }

  renderViewer(children) {
    if (!children) return null
    return React.Children.map(children, child =>
      React.cloneElement(child, {
        files: this.props.files || []
      })
    )
  }
}

export default translate()(FolderView)
