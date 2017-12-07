import React, { Component } from 'react'
import { connect } from 'react-redux'
import Viewer from 'viewer'

import { getFolderUrl } from '../reducers'
import { getFilesWithLinks } from '../reducers/view'
import { isCordova } from '../mobile/lib/device'
import { fetchMoreFiles } from '../actions'

const LIMIT = 30

const getParentPath = router => {
  const url = router.location.pathname
  return url.substring(0, url.lastIndexOf('/'))
}

class FilesViewer extends Component {
  fetchMore() {
    const { files, params, fetchMoreFiles } = this.props
    const currentIndex = files.findIndex(f => f.id === params.fileId)
    if (files.length - currentIndex <= 5) {
      fetchMoreFiles(params.folderId, files.length, LIMIT)
    }
  }

  componentDidMount() {
    this.fetchMore()
  }

  componentWillReceiveProps(props, nextProps) {
    this.fetchMore()
  }

  render() {
    if (this.props.files.length === 0) return null
    // TODO: temp fix for thumbnail links on mobile
    if (isCordova() && !this.props.filesWithLinks) return null
    const files = isCordova()
      ? this.props.filesWithLinks
          .filter(f => f.type !== 'directory')
          .map(f => ({
            ...f,
            isAvailableOffline: this.props.isAvailableOffline(f.id)
          }))
      : this.props.files.filter(f => f.type !== 'directory')
    const { params, router } = this.props
    const currentIndex = files.findIndex(f => f.id === params.fileId)
    // TODO: if we can't find the file, that's probably because the user is trying to open
    // a direct link to a file that wasn't in the first 50 files of the containing folder
    // (it comes from a fetchMore...)
    if (currentIndex === -1) {
      router.push({
        pathname: getFolderUrl(params.folderId, router.location)
      })
      return null
    }
    return (
      <Viewer
        files={files}
        currentIndex={currentIndex}
        onChange={nextFile => {
          router.push({
            pathname: `${getParentPath(router)}/${nextFile.id}`
          })
        }}
        onClose={() => {
          router.push({
            pathname: getFolderUrl(params.folderId, router.location)
          })
        }}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  filesWithLinks: getFilesWithLinks(
    state,
    ownProps.params.folderId || 'io.cozy.files.root-dir'
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchMoreFiles: (folderId, skip, limit) => {
    dispatch(fetchMoreFiles(folderId, skip, limit))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(FilesViewer)
