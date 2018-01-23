import React, { Component } from 'react'
import { connect } from 'react-redux'
import Viewer from 'viewer'
import { LoadingViewer } from 'viewer/Viewer'
import Alerter from 'photos/components/Alerter'
import { getFolderIdFromRoute } from '../reducers/view'
import { fetchMoreFiles, fetchRecentFilesFromStack } from '../actions'

const LIMIT = 30

const getParentPath = router => {
  const url = router.location.pathname
  return url.substring(0, url.lastIndexOf('/'))
}

class FilesViewer extends Component {
  state = {
    filesWithLinks: null,
    loading: false
  }

  componentWillMount() {
    if (this.needLinks()) {
      this.setState(state => ({ ...state, loading: true }))
      this.fetchFilesWithLinks()
        .then(files => {
          this.setState(state => ({
            ...state,
            filesWithLinks: files,
            loading: false
          }))
        })
        .catch(() => Alerter.error('Viewer.error.noNetwork'))
    }
  }

  componentDidMount() {
    this.fetchMore()
  }

  componentWillReceiveProps(props, nextProps) {
    this.fetchMore()
  }

  needLinks() {
    return this.props.files.some(f => f.class === 'image' && !f.links)
  }

  isFetchingLinks() {
    return this.needLinks() && this.state.loading
  }

  getFiles() {
    return this.needLinks()
      ? this.state.filesWithLinks
          .filter(f => f.type !== 'directory')
          .map(f => ({
            ...f,
            isAvailableOffline: this.props.isAvailableOffline(f.id)
          }))
      : this.props.files.filter(f => f.type !== 'directory')
  }

  // if we get close of the last file fetched, but we know there are more in the folder
  // (it shouldn't happen in /recent), we fetch 50 more files
  fetchMore() {
    if (this.isFetchingLinks()) return
    const files = this.needLinks()
      ? this.state.filesWithLinks
      : this.props.files
    const { params, location, fetchMoreFiles, fileCount } = this.props
    const currentIndex = files.findIndex(f => f.id === params.fileId)
    if (files.length !== fileCount && files.length - currentIndex <= 5) {
      const folderId = getFolderIdFromRoute(location, params)
      if (this.needLinks()) {
        this.context.client
          .fetchFilesForLinks(folderId, files.length)
          .then(files => {
            this.setState(state => ({
              ...state,
              filesWithLinks: [...state.filesWithLinks, ...files]
            }))
          })
      } else {
        fetchMoreFiles(folderId, files.length, LIMIT)
      }
    }
  }

  fetchFilesWithLinks() {
    const { params, location } = this.props
    const folderId = getFolderIdFromRoute(location, params)
    if (!folderId) {
      // we must be in /recent
      return fetchRecentFilesFromStack()
    } else {
      return this.context.client.fetchFilesForLinks(folderId)
    }
  }

  onClose = () => {
    const { router } = this.props
    const url = router.location.pathname
    router.push({
      pathname: url.substring(0, url.lastIndexOf('/file'))
    })
  }

  render() {
    if (this.isFetchingLinks()) {
      return <LoadingViewer />
    }
    const files = this.getFiles()
    if (files.length === 0) return null
    const { params, router } = this.props
    const currentIndex = files.findIndex(f => f.id === params.fileId)
    // TODO: if we can't find the file, that's probably because the user is trying to open
    // a direct link to a file that wasn't in the first 50 files of the containing folder
    // (it comes from a fetchMore...)
    if (currentIndex === -1) {
      console.warn("can't find the file " + params.fileId)
      this.onClose()
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
