import React, { Component } from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import { Alerter } from 'cozy-ui/react/Alerter'

import Loading from './Loading'
import Empty from './Empty'
import Oops from './Oops'
import FileListHeader from './FileListHeader'
import FileList from './FileList'

import FilesSelectionBar from '../containers/FilesSelectionBar'
import TrashSelectionBar from '../containers/TrashSelectionBar'
import FileActionMenu from '../containers/FileActionMenu'
import DeleteConfirmation from '../containers/DeleteConfirmation'
import UploadProgression from '../../mobile/src/containers/UploadProgression'

import styles from '../styles/table'

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

class FolderView extends Component {
  render () {
    const { isTrashContext, showSelection, showDeleteConfirmation, showActionMenu } = this.props
    const { selected, actions } = this.props
    return (
      <div role='contentinfo'>
        <Alerter />
        {__TARGET__ === 'mobile' && <UploadProgression />}
        {!isTrashContext && showSelection && <FilesSelectionBar selected={selected} {...actions.selection} />}
        {isTrashContext && showSelection && <TrashSelectionBar selected={selected} {...actions.selection} />}
        {showDeleteConfirmation && <DeleteConfirmation />}
        <div className={classNames(
          styles['fil-content-table'],
          { [styles['fil-content-table-selection']]: showSelection }
        )}>
          <FileListHeader />
          <div className={styles['fil-content-body']}>
            <FolderContent {...this.props} />
          </div>
        </div>
        {showActionMenu && <FileActionMenu isTrashContext={isTrashContext} />}
      </div>
    )
  }
}

export default translate()(FolderView)
