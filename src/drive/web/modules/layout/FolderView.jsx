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
    const { children, isTrashContext, selectionModeActive } = this.props
    const {
      displayedFolder,
      files,
      selected,
      actions,
      Toolbar,
      canSort,
      canDrop,
      canUpload,
      canCreateFolder
    } = this.props
    const { showSelectionBar, uploadFiles } = this.props

    const nothingToDo = isTrashContext && files.length === 0
    const folderId = getFolderIdFromRoute(
      this.props.location,
      this.props.params
    )
    const isRootfolder = folderId === ROOT_DIR_ID

    const toolbarActions = {}
    if (canCreateFolder) toolbarActions.addFolder = this.toggleAddFolder
    return (
      <Main>
        <Topbar>
          <Breadcrumb />
          <AsyncBoundary>
            {({ isLoading, isInError }) => (
              <Toolbar
                folderId={folderId}
                actions={toolbarActions}
                canUpload={canUpload}
                disabled={
                  isInError || isLoading || selectionModeActive || nothingToDo
                }
                onSelectItemsClick={showSelectionBar}
              />
            )}
          </AsyncBoundary>
        </Topbar>
        <Dropzone
          role="main"
          disabled={__TARGET__ === 'mobile' || !canDrop}
          displayedFolder={displayedFolder}
          onDrop={uploadFiles}
        >
          {__TARGET__ === 'mobile' && (
            <div>
              {isRootfolder && <MediaBackupProgression />}
              <FirstUploadModal />
              <RatingModal />
            </div>
          )}
          <div style={{ display: selectionModeActive ? 'inherit' : 'none' }}>
            <SelectionBar selected={selected} actions={actions.selection} />
          </div>
          <FileList
            {...this.props}
            canSort={canSort}
            selectionModeActive={selectionModeActive}
            fileActions={actions.selection}
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
        files: this.props.files || [],
        isAvailableOffline: this.props.isAvailableOffline
      })
    )
  }
}

export default translate()(FolderView)
