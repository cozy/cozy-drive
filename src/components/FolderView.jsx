/* global __TARGET__ */
import React, { Component } from 'react'
import { translate } from '../lib/I18n'

import { Alerter } from 'cozy-ui/react/Alerter'

import Loading from './Loading'
import Empty from './Empty'
import Oops from './Oops'
import FileListHeader from './FileListHeader'
import FileList from './FileList'

import Breadcrumb from '../containers/Breadcrumb'
import SelectionBar from './SelectionBar'
import AddFolder from './AddFolder'
import FileActionMenu from '../containers/FileActionMenu'
import UploadProgression from '../../mobile/src/containers/UploadProgression'

import styles from '../styles/folderview'

const FolderContent = props => {
  const { fetchStatus, files, isAddingFolder, canUpload } = props
  switch (fetchStatus) {
    case 'pending':
      return <Loading message={props.t('loading.message')} />
    case 'failed':
      return <Oops />
    case 'loaded':
      return files.length === 0 && !isAddingFolder
        ? <Empty canUpload={canUpload} />
        : <FileList {...props} />
  }
}

const toggle = (flag, state, props) => ({ [flag]: !state[flag] })

class FolderView extends Component {
  state = {
    showAddFolder: false,
    selectionMode: false
  };
  toggleSelectionMode = () => {
    this.setState(toggle.bind(null, 'selectionMode'))
  }
  quitSelectionMode = () => {
    this.props.unselectAll()
    this.setState({ selectionMode: false })
  }
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
    const { isTrashContext, showActionMenu } = this.props
    const { selected, actions, Toolbar } = this.props
    const { onShowActionMenu } = this.props

    const { showAddFolder, selectionMode } = this.state

    const selectionModeActive = selected.length !== 0 || selectionMode === true
    const fetchFailed = this.props.fetchStatus === 'failed'

    const toolbarActions = {
      addFolder: this.toggleAddFolder
    }
    return (
      <main class={styles['fil-content']}>
        <div class={styles['fil-topbar']}>
          <Breadcrumb />
          <Toolbar
            actions={toolbarActions}
            disabled={fetchFailed || selectionModeActive}
            onSelectItemsClick={this.toggleSelectionMode}
          />
        </div>
        <div role='contentinfo'>
          <Alerter />
          {__TARGET__ === 'mobile' && <UploadProgression />}
          {selectionModeActive &&
            <SelectionBar
              selected={selected}
              actions={actions.selection}
              onClose={this.toggleSelectionMode}
              onActionComplete={this.quitSelectionMode}
              onMoreClick={onShowActionMenu}
            />}
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
              />
            </div>
          </div>
          {showActionMenu && <FileActionMenu isTrashContext={isTrashContext} />}
        </div>
      </main>
    )
  }
}

export default translate()(FolderView)
