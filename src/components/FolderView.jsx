/* global __TARGET__ */
import React, { Component } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import Main from './Main'
import Topbar from './Topbar'
import Spinner from 'cozy-ui/react/Spinner'
import Empty, { EmptyTrash } from './Empty'
import Oops from './Oops'
import FileListHeader from './FileListHeader'
import FileList from './FileList'

import Breadcrumb from '../containers/Breadcrumb'
import { SelectionBar } from '../ducks/selection'
import AddFolder from './AddFolder'
import FileActionMenu from './FileActionMenu'
import UploadProgression from '../../mobile/src/containers/UploadProgression'

import styles from '../styles/folderview'

const FolderContent = props => {
  const { fetchStatus, files, isAddingFolder } = props
  switch (fetchStatus) {
    case 'pending':
      return <Spinner
        size='xxlarge'
        loadingType='message'
        middle='true'
      />
    case 'failed':
      return <Oops />
    case 'loaded':
      return files.length === 0 && !isAddingFolder
        ? <EmptyContent {...props} />
        : <FileList {...props} />
    default:
      return null
  }
}

const EmptyContent = props => {
  const { isTrashContext, canUpload } = props
  if (isTrashContext && !props.params.folderId) {
    return <EmptyTrash />
  }
  return <Empty canUpload={canUpload} />
}

const toggle = (flag, state, props) => ({ [flag]: !state[flag] })

class FolderView extends Component {
  state = {
    showAddFolder: false
  };

  toggleAddFolder = () => {
    this.setState(toggle.bind(null, 'showAddFolder'))
  }

  createFolder = name => {
    return this.props.actions.list.createFolder(name)
      .then(() => this.toggleAddFolder())
  }

  abortAddFolder = accidental => {
    this.props.actions.list.abortAddFolder(accidental)
    this.toggleAddFolder()
  }

  render () {
    const { isTrashContext, actionMenuActive, selectionModeActive } = this.props
    const { files, selected, actionable, actions, Toolbar } = this.props
    const { hideActionMenu, showSelectionBar } = this.props

    const { showAddFolder } = this.state

    const fetchFailed = this.props.fetchStatus === 'failed'
    const fetchPending = this.props.fetchStatus === 'pending'
    const nothingToDo = isTrashContext && files.length === 0

    const toolbarActions = {
      addFolder: this.toggleAddFolder
    }
    return (
      <Main>
        <Topbar>
          <Breadcrumb />
          <Toolbar
            actions={toolbarActions}
            disabled={fetchFailed || fetchPending || selectionModeActive || nothingToDo}
            onSelectItemsClick={showSelectionBar}
          />
        </Topbar>
        <div role='contentinfo'>
          {__TARGET__ === 'mobile' && <UploadProgression />}
          {selectionModeActive && <SelectionBar selected={selected} actions={actions.selection} />}
          <div className={styles['fil-content-table']}>
            <FileListHeader />
            <div className={styles['fil-content-body']}>
              {showAddFolder &&
                <AddFolder
                  onSubmit={this.createFolder}
                  onAbort={this.abortAddFolder}
                />}
              <FolderContent
                {...this.props}
                selectionModeActive={selectionModeActive}
                isAddingFolder={showAddFolder}
              />
            </div>
          </div>
          {actionMenuActive &&
            <FileActionMenu
              files={actionable}
              actions={actions.selection}
              onClose={hideActionMenu}
            />}
        </div>
      </Main>
    )
  }
}

export default translate()(FolderView)
