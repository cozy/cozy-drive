import React, { Component } from 'react'
import { connect } from 'react-redux'
import compose from 'lodash/flowRight'
import { useQuery, withClient } from 'cozy-client'
import { Overlay, Spinner, Viewer } from 'cozy-ui/transpiled/react'
import { translate } from 'cozy-ui/transpiled/react/I18n'
import logger from 'lib/logger'
import Fallback from 'drive/web/modules/viewer/Fallback'
import palette from 'cozy-ui/transpiled/react/palette'
import { buildQuery } from 'drive/web/modules/queries'
import { useFolderSort } from 'drive/web/modules/navigation/duck'
import {
  getCurrentFolderId,
  getCurrentFileId
} from 'drive/web/modules/selectors'
import { getFolderPath, getViewerPath } from 'drive/web/modules/routeUtils'

const FilesViewerLoading = () => (
  <Overlay>
    <Spinner size="xxlarge" middle noMargin color={palette.white} />
  </Overlay>
)

/**
 * Shows a set of files through cozy-ui's Viewer
 *
 * - Re-uses the cozy-client's Query for the current directory files
 *   with the same sort order.
 * - If the file to show is not present in the query results, will call
 *   fetchMore() on the query
 */
class FilesViewer extends Component {
  state = {
    currentFile: null
  }

  _mounted = false

  componentDidMount() {
    this._mounted = true
    this.fetchFileIfNecessary()
    this.fetchMoreIfNecessary()
  }

  componentWillReceiveProps() {
    this.fetchMoreIfNecessary()
  }

  componentWillUnmount() {
    this._mounted = false
  }

  // If we can't find the file in the loaded files, that's probably because the user
  // is trying to open a direct link to a file that wasn't in the first 50 files of
  // the containing folder (it comes from a fetchMore...) ; we load the file attributes
  // directly as a contingency measure
  async fetchFileIfNecessary() {
    if (this.getCurrentIndex() !== -1) return
    if (this.state.currentFile && this._mounted) {
      this.setState({ currentFile: null })
    }

    const { fileId, client } = this.props
    try {
      const { data } = await client.query(client.get('io.cozy.files', fileId))
      this.setState({
        currentFile: data
      })
    } catch (e) {
      logger.warn("can't find the file")
      this.onClose()
    }
  }

  async fetchMoreIfNecessary() {
    if (this.fetchingMore) {
      return
    }
    this.fetchingMore = true
    try {
      const { files, fileId, filesQuery } = this.props
      const fileCount = filesQuery.count
      // If we get close of the last file fetched, but we know there are more in the folder
      // (it shouldn't happen in /recent), we fetch more files
      const currentIndex = files.findIndex(f => f.id === fileId)

      if (files.length !== fileCount && files.length - currentIndex <= 5) {
        await filesQuery.fetchMore()
      }
    } finally {
      this.fetchingMore = false
    }
  }

  onClose = () => {
    const { router, folderId } = this.props
    router.push({
      pathname: getFolderPath(folderId)
    })
  }

  onChange = nextFile => {
    const { router, folderId } = this.props
    router.push({
      pathname: getViewerPath(folderId, nextFile.id)
    })
  }

  getCurrentIndex() {
    const { files, fileId } = this.props
    // console.log({ files, fileId })
    return files.findIndex(f => f.id === fileId)
  }

  render() {
    const { t, files } = this.props
    const currentIndex = this.getCurrentIndex()

    // If we can't find the file, we fallback to the (potentially loading)
    // direct stat made by the viewer
    if (currentIndex === -1 && !this.state.currentFile) {
      return <FilesViewerLoading />
    } else {
      const hasCurrentIndex = currentIndex != -1
      const viewerFiles = hasCurrentIndex ? files : [this.state.currentFile]
      const viewerIndex = hasCurrentIndex ? currentIndex : 0

      return (
        <Overlay>
          <Viewer
            files={viewerFiles}
            currentIndex={viewerIndex}
            onChangeRequest={this.onChange}
            onCloseRequest={this.onClose}
            renderFallbackExtraContent={file => <Fallback file={file} t={t} />}
          />
        </Overlay>
      )
    }
  }
}

const mapStateToProps = state => ({
  folderId: getCurrentFolderId(state),
  fileId: getCurrentFileId(state)
})

const FilesViewerWithQuery = props => {
  const [{ sortAttribute, sortOrder }] = useFolderSort()
  const filesQuery = buildQuery({
    currentFolderId: props.folderId,
    type: 'file',
    sortAttribute: sortAttribute,
    sortOrder: sortOrder
  })
  const results = useQuery(filesQuery.definition, filesQuery.options)
  if (results.data) {
    const viewableFiles = results.data
    return <FilesViewer {...props} files={viewableFiles} filesQuery={results} />
  } else {
    return <FilesViewerLoading />
  }
}

export default compose(
  withClient,
  connect(mapStateToProps),
  translate()
)(FilesViewerWithQuery)
