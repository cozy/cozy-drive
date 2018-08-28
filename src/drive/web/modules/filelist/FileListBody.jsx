import React, { Component } from 'react'
import Alerter from 'cozy-ui/react/Alerter'

import AsyncFileListRows from 'drive/web/modules/filelist/AsyncFileListRows'
import AddFolder from 'drive/web/modules/filelist/AddFolder'

import styles from 'drive/styles/filelist'

const toggle = (flag, state, props) => ({ [flag]: !state[flag] })

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
    return (
      <div className={styles['fil-content-body']}>
        {showAddFolder && (
          <AddFolder
            onSubmit={this.createFolder}
            onAbort={this.abortAddFolder}
          />
        )}
        <AsyncFileListRows {...this.props} isAddingFolder={showAddFolder} />
      </div>
    )
  }
}
