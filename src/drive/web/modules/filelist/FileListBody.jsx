import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Alerter from 'cozy-ui/react/Alerter'
import Oops from 'components/Error/Oops'
import { EmptyDrive, EmptyTrash } from 'components/Error/Empty'
import AsyncBoundary from 'drive/web/modules/navigation/AsyncBoundary'
import FileListRowsPlaceholder from './FileListRowsPlaceholder'
import FileListRows from './FileListRows'
import AddFolder from './AddFolder'

import styles from 'drive/styles/filelist'

const toggle = (flag, state, props) => ({ [flag]: !state[flag] })

const EmptyContent = props => {
  const { isTrashContext, canUpload } = props
  if (isTrashContext && !props.params.folderId) {
    return <EmptyTrash />
  }
  return <EmptyDrive canUpload={canUpload} />
}

EmptyContent.propTypes = {
  isTrashContext: PropTypes.bool,
  canUpload: PropTypes.bool,
  params: PropTypes.object
}

EmptyContent.defaultProps = {
  isTrashContext: false,
  canUpload: false,
  params: {}
}

export default class FileListBody extends Component {
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
    if (accidental) {
      Alerter.info('alert.folder_abort')
    }
    this.toggleAddFolder()
  }

  render() {
    const { showAddFolder } = this.state
    const { files } = this.props
    return (
      <div className={styles['fil-content-body']}>
        {showAddFolder && (
          <AddFolder
            onSubmit={this.createFolder}
            onAbort={this.abortAddFolder}
          />
        )}
        <AsyncBoundary>
          {({ isLoading, isInError }) => {
            if (isLoading) return <FileListRowsPlaceholder />
            else if (isInError) return <Oops />
            else if (files.length === 0 && !showAddFolder)
              return <EmptyContent {...this.props} />
            else return <FileListRows withSelectionCheckbox {...this.props} />
          }}
        </AsyncBoundary>
      </div>
    )
  }
}
