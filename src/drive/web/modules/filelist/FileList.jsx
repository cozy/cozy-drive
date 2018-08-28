import React, { Component } from 'react'

import FileListHeader, {
  MobileFileListHeader
} from 'drive/web/modules/filelist/FileListHeader'
import FileListBody from 'drive/web/modules/filelist/FileListBody'

import styles from 'drive/styles/filelist'

export default class FileList extends Component {
  render() {
    const { canSort } = this.props
    return (
      <div className={styles['fil-content-table']} role="table">
        <MobileFileListHeader canSort={canSort} />
        <FileListHeader canSort={canSort} />
        <FileListBody {...this.props} />
      </div>
    )
  }
}
