import React, { Component } from 'react'
import { connect } from 'react-redux'
import Viewer from 'viewer'

import { getFolderUrl } from '../reducers'
import { getFilesWithLinks } from '../reducers/view'
import { isCordova } from '../mobile/lib/device'

const getParentPath = router => {
  const url = router.location.pathname
  return url.substring(0, url.lastIndexOf('/'))
}

class FilesViewer extends Component {
  render() {
    if (this.props.files.length === 0) return null
    if (isCordova() && !this.props.filesWithLinks) return null
    const files = isCordova()
      ? this.props.filesWithLinks.filter(f => f.type !== 'directory')
      : this.props.files.filter(f => f.type !== 'directory')
    const { params, router } = this.props
    const currentIndex = files.findIndex(f => f.id === params.fileId)
    return (
      <Viewer
        files={files}
        currentIndex={currentIndex}
        onChange={nextFile =>
          router.push({
            pathname: `${getParentPath(router)}/${nextFile.id}`
          })
        }
        onClose={() =>
          router.push({
            pathname: getFolderUrl(params.folderId, router.location)
          })
        }
      />
    )
  }
}

export default connect((state, ownProps) => ({
  filesWithLinks: getFilesWithLinks(
    state,
    ownProps.params.folderId || 'io.cozy.files.root-dir'
  )
}))(FilesViewer)
