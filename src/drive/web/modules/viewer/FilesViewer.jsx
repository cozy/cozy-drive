/* global cozy */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Overlay } from 'cozy-ui/transpiled/react'
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
    currentFile: null
  }

  componentDidMount() {
    this.fetchFileIfNecessary()
    this.fetchMoreIfNecessary()
  }

  componentWillReceiveProps() {
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
      .catch(() => {
        // eslint-disable-next-line no-console
        console.warn("can't find the file")
        this.onClose()
      })
  }

  // If we get close of the last file fetched, but we know there are more in the folder
  // (it shouldn't happen in /recent), we fetch 50 more files
  fetchMoreIfNecessary() {
    const { files, params, location, fetchMoreFiles, fileCount } = this.props
    if (files.length === 0) return // we get there when loading a direct URL and the folder's content is still loading
    const currentIndex = files.findIndex(f => f.id === params.fileId)
    if (files.length !== fileCount && files.length - currentIndex <= 5) {
      const folderId = getFolderIdFromRoute(location, params)
      fetchMoreFiles(folderId, files.length, FILES_FETCH_LIMIT)
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
        <Overlay>
          <Viewer
            files={[this.state.currentFile]}
            currentIndex={0}
            onChange={this.onChange}
            onClose={this.onClose}
          />
        </Overlay>
      )
    }
    return (
      <Overlay>
        <Viewer
          files={files}
          currentIndex={currentIndex}
          onChange={this.onChange}
          onClose={this.onClose}
        />
      </Overlay>
    )
  }
}

const mapStateToProps = state => ({
  fileCount: state.view.fileCount
})

const mapDispatchToProps = dispatch => ({
  fetchMoreFiles: (folderId, skip, limit) => {
    dispatch(fetchMoreFiles(folderId, skip, limit))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilesViewer)
