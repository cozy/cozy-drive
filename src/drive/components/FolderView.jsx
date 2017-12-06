/* global __TARGET__ */
import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import Main from './Main'
import Topbar from './Topbar'
import FileListHeader from './FileListHeader'

import Breadcrumb from '../containers/Breadcrumb'
import { SelectionBar } from '../ducks/selection'
import AddFolder from './AddFolder'
import FileActionMenu from './FileActionMenu'
import MediaBackupProgression from '../mobile/containers/MediaBackupProgression'
import RatingModal from '../mobile/containers/RatingModal'
import FirstUploadModal from '../mobile/containers/FirstUploadModal'
import FolderContent from './FolderContent'

import styles from '../styles/folderview'

const toggle = (flag, state, props) => ({ [flag]: !state[flag] })

class FolderView extends Component {
  state = {
    showAddFolder: false
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

  render() {
    const {
      children,
      isTrashContext,
      actionMenuActive,
      selectionModeActive
    } = this.props
    const {
      params,
      files,
      selected,
      actionable,
      actions,
      Toolbar,
      canUpload,
      canCreateFolder
    } = this.props
    const { hideActionMenu, showSelectionBar } = this.props

    const { showAddFolder } = this.state

    const fetchFailed = this.props.fetchStatus === 'failed'
    const fetchPending = this.props.fetchStatus === 'pending'
    const nothingToDo = isTrashContext && files.length === 0

    const toolbarActions = {}
    if (canCreateFolder) toolbarActions.addFolder = this.toggleAddFolder
    return (
      <Main>
        <Topbar>
          <Breadcrumb />
          <Toolbar
            folderId={params.folderId}
            actions={toolbarActions}
            canUpload={canUpload}
            disabled={
              fetchFailed || fetchPending || selectionModeActive || nothingToDo
            }
            onSelectItemsClick={showSelectionBar}
          />
        </Topbar>
        <div role="contentinfo">
          {__TARGET__ === 'mobile' && (
            <div>
              <MediaBackupProgression />
              <FirstUploadModal />
              <RatingModal />
            </div>
          )}
          <div style={{ display: selectionModeActive ? 'inherit' : 'none' }}>
            <SelectionBar selected={selected} actions={actions.selection} />
          </div>
          <div className={styles['fil-content-table']}>
            <FileListHeader />
            <div className={styles['fil-content-body']}>
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
        </div>
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
