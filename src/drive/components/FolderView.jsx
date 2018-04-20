/* global __TARGET__ */
import React, { Component } from 'react'
import cx from 'classnames'
import { translate } from 'cozy-ui/react/I18n'
import Dropzone from 'react-dropzone'

import Main from './Main'
import Topbar from './Topbar'
import FileListHeader, { MobileFileListHeader } from './FileListHeader'

import { ROOT_DIR_ID } from '../constants/config'
import Breadcrumb from '../containers/Breadcrumb'
import { SelectionBar } from '../ducks/selection'
import { getFolderIdFromRoute } from '../reducers/view'
import AddFolder from './AddFolder'
import FileActionMenu from './FileActionMenu'
import MediaBackupProgression from '../mobile/containers/MediaBackupProgression'
import RatingModal from '../mobile/containers/RatingModal'
import FirstUploadModal from '../mobile/containers/FirstUploadModal'
import FolderContent from './FolderContent'
import DropzoneTeaser from './DropzoneTeaser'

import styles from '../styles/folderview'

const toggle = (flag, state, props) => ({ [flag]: !state[flag] })

class FolderView extends Component {
  state = {
    showAddFolder: false,
    dropzoneActive: false
  }

  toggleAddFolder = () => {
    this.setState(toggle.bind(null, 'showAddFolder'))
  }

  createFolder = name => {
    return this.props.actions.list
      .createFolder(name)
      .then(() => this.toggleAddFolder())
  }

  abortAddFolder = accidental => {
    this.props.actions.list.abortAddFolder(accidental)
    this.toggleAddFolder()
  }

  onDragEnter = () =>
    this.setState(state => ({ ...state, dropzoneActive: true }))
  onDragLeave = () =>
    this.setState(state => ({ ...state, dropzoneActive: false }))

  onDrop = files => {
    const folderId = getFolderIdFromRoute(
      this.props.location,
      this.props.params
    )
    this.setState(state => ({ ...state, dropzoneActive: false }))
    this.props.uploadFiles(files, folderId)
  }

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
    const { hideActionMenu, showSelectionBar } = this.props

    const { showAddFolder, dropzoneActive } = this.state

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
          role="contentinfo"
          disabled={__TARGET__ === 'mobile' || !canDrop}
          disableClick
          style={{}}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
        >
          {dropzoneActive && (
            <DropzoneTeaser
              currentFolderName={displayedFolder && displayedFolder.name}
            />
          )}
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

          <div className={styles['fil-content-table']}>
            <MobileFileListHeader canSort={canSort} />
            <FileListHeader canSort={canSort} />
            <div
              className={cx(styles['fil-content-body'], {
                [styles['fil-content-dropzone-active']]: dropzoneActive
              })}
            >
              {showAddFolder && (
                <AddFolder
                  onSubmit={this.createFolder}
                  onAbort={this.abortAddFolder}
                />
              )}
              <FolderContent
                {...this.props}
                selectionModeActive={selectionModeActive}
                isAddingFolder={showAddFolder}
                isLoading={fetchPending || isNavigating}
                isInError={fetchFailed}
              />
            </div>
          </div>
          {this.renderViewer(children)}
          {actionMenuActive && (
            <FileActionMenu
              files={actionable}
              actions={actions.selection}
              onClose={hideActionMenu}
            />
          )}
        </Dropzone>
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
