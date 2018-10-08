/* global cozy */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Viewer, { LoadingViewer } from 'viewer'
import {
  getFolderIdFromRoute,
  fetchMoreFiles
} from 'drive/web/modules/navigation/duck'
import { FILES_FETCH_LIMIT } from 'drive/constants/config'

const getParentPath = router => {
  const url = router.location.pathname
  return url.substring(0, url.lastIndexOf('/'))
}

class FilesViewer extends Component {
  state = {
    currentFile: null,
    shoudLoadMore: true
  }

  componentDidMount() {
    this.lastLengthFetched = -1
    this.fetchFileIfNecessary()
    this.fetchMoreIfNecessary()
  }

  componentWillReceiveProps(props, nextProps) {
    this.fetchMoreIfNecessary()
  }

  // If we can't find the file in the loaded files, that's probably because the user is trying to open
  // a direct link to a file that wasn't in the first 50 files of the containing folder
  // (it comes from a fetchMore...) ; we load the file attributes directly as a contingency measure
  fetchFileIfNecessary() {
    if (this.getCurrentIndex() !== -1) return
    if (this.state.currentFile)
      this.setState(state => ({ ...state, currentFile: null }))

    cozy.client.files
      .statById(this.props.params.fileId)
      .then(resp => {
        this.setState(state => ({
          ...state,
          currentFile: { ...resp, ...resp.attributes, id: resp._id }
        }))
      })
      .catch(e => {
        console.warn("can't find the file")
        this.onClose()
      })
  }

  // If we get close of the last file fetched (-5), but we know there are more in the folder
  // (it shouldn't happen in /recent), we fetch FILES_FETCH_LIMIT more files
  async fetchMoreIfNecessary() {
    const { files, params, location, fetchMoreFiles } = this.props
    const currentIndex = files.findIndex(f => f.id === params.fileId)
    const folderId = getFolderIdFromRoute(location, params)
    // As fetchMoreIfNecessary is called every time, we had to check if we need to
    // fetch more files. To do so, we simply store the latest length of files loaded
    if (
      currentIndex - files.length - 5 > 0 &&
      this.lastLengthFetched !== files.length
    ) {
      const result = await fetchMoreFiles(
        folderId,
        files.length,
        FILES_FETCH_LIMIT
      )
      this.lastLengthFetched = result.files.length
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
    const currentIndex = this.getCurrentIndex(files)
    // If we can't find the file, we fallback to the (potentially loading)
    // direct stat made by the viewer
    if (currentIndex === -1) {
      if (!this.state.currentFile) {
        return <LoadingViewer />
      }
      return (
        <Viewer
          files={[this.state.currentFile]}
          currentIndex={0}
          onChange={this.onChange}
          onClose={this.onClose}
        />
      )
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
    return dispatch(fetchMoreFiles(folderId, skip, limit))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(FilesViewer)
