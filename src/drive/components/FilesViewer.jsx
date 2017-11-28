import React, { Component } from 'react'
import Viewer from 'viewer'

import { getFolderUrl } from '../reducers'

const getParentPath = router => {
  const url = router.location.pathname
  return url.substring(0, url.lastIndexOf('/'))
}

export default class FilesViewer extends Component {
  render() {
    if (this.props.files.length === 0) return null
    const files = this.props.files.filter(f => f.type !== 'directory')
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
