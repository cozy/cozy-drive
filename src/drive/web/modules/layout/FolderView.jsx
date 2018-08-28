/* global __TARGET__ */
import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'
import { ModalManager } from 'react-cozy-helpers'

import { ROOT_DIR_ID } from 'drive/constants/config'

import MediaBackupProgression from 'drive/mobile/modules/mediaBackup/MediaBackupProgression'
import RatingModal from 'drive/mobile/modules/settings/RatingModal'
import FirstUploadModal from 'drive/mobile/modules/mediaBackup/FirstUploadModal'

import FileActionMenu from 'drive/web/modules/actionmenu/FileActionMenu'
import FileList from 'drive/web/modules/filelist/FileList'
import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'
import Dropzone from 'drive/web/modules/upload/Dropzone'
import { getFolderIdFromRoute } from 'drive/web/modules/navigation/duck'
import Main from './Main'
import Topbar from './Topbar'

class FolderView extends Component {
  render() {
    const {
      children,
      isTrashContext,
      actionMenuActive,
      selectionModeActive
    } = this.props
    const {
      displayedFolder,
      files,
      selected,
      actionable,
      actions,
      Toolbar,
      canSort,
      canDrop,
      canUpload,
      canCreateFolder
    } = this.props
    const { hideActionMenu, showSelectionBar, uploadFiles } = this.props

    const fetchFailed = this.props.fetchStatus === 'failed'
    const fetchPending = this.props.fetchStatus === 'pending'
    const isNavigating = this.props.isNavigating
    const nothingToDo = isTrashContext && files.length === 0
    const folderId = getFolderIdFromRoute(
      this.props.location,
      this.props.params
    )
    const isRootfolder = folderId === ROOT_DIR_ID

    const toolbarActions = {}
    if (canCreateFolder) toolbarActions.addFolder = this.toggleAddFolder
    return (
      <Main working={isNavigating}>
        <Topbar>
          <Breadcrumb />
          <Toolbar
            folderId={folderId}
            actions={toolbarActions}
            canUpload={canUpload}
            disabled={
              fetchFailed || fetchPending || selectionModeActive || nothingToDo
            }
            onSelectItemsClick={showSelectionBar}
          />
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
            isLoading={fetchPending || isNavigating}
            isInError={fetchFailed}
          />
          {this.renderViewer(children)}
          {actionMenuActive && (
            <FileActionMenu
              files={actionable}
              actions={actions.selection}
              onClose={hideActionMenu}
            />
          )}
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
