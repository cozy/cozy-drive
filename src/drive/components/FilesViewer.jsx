import React, { Component } from 'react'
import { connect } from 'react-redux'
import Viewer from 'viewer'
import { getFolderIdFromRoute } from '../reducers/view'
import { fetchMoreFiles } from '../actions'

const LIMIT = 30

const getParentPath = router => {
  const url = router.location.pathname
  return url.substring(0, url.lastIndexOf('/'))
}

class FilesViewer extends Component {
  componentDidMount() {
    this.fetchMoreIfNecessary()
  }

  componentWillReceiveProps(props, nextProps) {
    this.fetchMoreIfNecessary()
  }

  // if we get close of the last file fetched, but we know there are more in the folder
  // (it shouldn't happen in /recent), we fetch 50 more files
  fetchMoreIfNecessary() {
    const { files, params, location, fetchMoreFiles, fileCount } = this.props
    if (files.length === 0) return // we get there when loading a direct URL and the folder's content is still loading
    const currentIndex = files.findIndex(f => f.id === params.fileId)
    if (files.length !== fileCount && files.length - currentIndex <= 5) {
      const folderId = getFolderIdFromRoute(location, params)
      fetchMoreFiles(folderId, files.length, LIMIT)
    }
  }

  onClose = () => {
    const { router } = this.props
    const url = router.location.pathname
    router.push({
      pathname: url.substring(0, url.lastIndexOf('/file'))
    })
  }

  onChange = nextFile => {
    const { router } = this.props
    router.push({
      pathname: `${getParentPath(router)}/${nextFile.id}`
    })
  }

  getViewableFiles() {
    return this.props.files.filter(f => f.type !== 'directory')
  }

  getCurrentIndex(files = this.getViewableFiles()) {
    return files.findIndex(f => f.id === this.props.params.fileId)
  }

  render() {
    const files = this.getViewableFiles()
    if (files.length === 0) return null
    const currentIndex = this.getCurrentIndex(files)
    // TODO: if we can't find the file, that's probably because the user is trying to open
    // a direct link to a file that wasn't in the first 50 files of the containing folder
    // (it comes from a fetchMore...)
    if (currentIndex === -1) {
      console.warn("can't find the file")
      this.onClose()
      return null
    }
    return (
      <Viewer
        files={files}
        currentIndex={currentIndex}
        onChange={this.onChange}
        onClose={this.onClose}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  fileCount: state.view.fileCount
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchMoreFiles: (folderId, skip, limit) => {
    dispatch(fetchMoreFiles(folderId, skip, limit))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(FilesViewer)
