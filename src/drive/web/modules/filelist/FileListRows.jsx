import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'cozy-ui/react/I18n'

import { isCordova } from 'drive/mobile/lib/device'
import { FILES_FETCH_LIMIT } from 'drive/constants/config'

import File from './File'
import FilePlaceholder from './FilePlaceholder'
import LoadMore from './LoadMore'

require('intersection-observer') // polyfill for safari

class FileListRows extends PureComponent {
  state = {
    isLoading: false,
    hasNoMoreRows: false
  }

  intersectionObserver = null
  loadMoreElement = null

  componentWillMount() {
    this.intersectionObserver = new IntersectionObserver(
      this.checkIntersectionsEntries
    )
  }

  checkIntersectionsEntries = intersectionEntries => {
    if (intersectionEntries.filter(entry => entry.isIntersecting).length > 0) {
      if (!this.state.isLoading) this.loadMoreRows(FILES_FETCH_LIMIT)
    }
  }

  updateLoadMoreElement = element => {
    if (this.loadMoreElement) {
      this.intersectionObserver.unobserve(this.loadMoreElement)
    }

    if (element) {
      // eslint-disable-next-line react/no-find-dom-node
      this.loadMoreElement = React.findDOMNode(element)
      this.intersectionObserver.observe(this.loadMoreElement)
    }
  }

  componentWillUnmount() {
    this.intersectionObserver.disconnect()
  }

  shouldDisplayLoadMore() {
    if (!this.props.displayedFolder) return false
    if (isCordova()) {
      if (this.props.files.length < FILES_FETCH_LIMIT) return false // We're in /recent
      return !this.state.hasNoMoreRows
    }
    return this.props.files.length < this.props.fileCount
  }

  render() {
    return (
      <div>
        {this.props.files.map((file, index) => {
          return this.rowRenderer({ index, key: file.id })
        })}
        {this.shouldDisplayLoadMore() && (
          <LoadMore
            ref={this.updateLoadMoreElement}
            onClick={() => {
              this.loadMoreRows(FILES_FETCH_LIMIT)
            }}
            isLoading={this.state.isLoading}
          />
        )}
      </div>
    )
  }

  loadMoreRows = limit => {
    this.setState(state => ({ ...state, isLoading: true }))
    const skip = this.props.files.length
    this.props
      .fetchMoreFiles(this.props.displayedFolder.id, skip, limit)
      .then(resp => {
        this.setState(state => ({
          ...state,
          isLoading: false,
          // if we get less files than the limit, there should be no more files to load
          hasNoMoreRows: resp.files.length < FILES_FETCH_LIMIT
        }))
      })
      .catch(() => {
        this.setState(state => ({ ...state, isLoading: false }))
      })
  }

  rowRenderer = ({ index, key }) => {
    const {
      displayedFolder,
      fileActions,
      onFolderOpen,
      onFileOpen,
      withSelectionCheckbox,
      withFilePath,
      withSharedBadge = true,
      isRenaming,
      renamingFile
    } = this.props
    const file = this.props.files[index]
    if (!file) {
      return <FilePlaceholder key={key} />
    }
    const isFileRenaming =
      isRenaming && renamingFile && renamingFile.id === file.id
    return (
      <File
        key={key}
        attributes={file}
        displayedFolder={displayedFolder}
        actions={fileActions}
        isRenaming={isFileRenaming}
        onFolderOpen={onFolderOpen}
        onFileOpen={onFileOpen}
        withSelectionCheckbox={withSelectionCheckbox}
        withFilePath={withFilePath}
        withSharedBadge={withSharedBadge}
      />
    )
  }
}

FileListRows.propTypes = {
  files: PropTypes.array,
  fileCount: PropTypes.number,
  fetchMoreFiles: PropTypes.func,
  displayedFolder: PropTypes.object,
  fileActions: PropTypes.object,
  onFolderOpen: PropTypes.func,
  onFileOpen: PropTypes.func,
  withSelectionCheckbox: PropTypes.bool,
  withFilePath: PropTypes.bool,
  withSharedBadge: PropTypes.bool,
  isRenaming: PropTypes.bool,
  renamingFile: PropTypes.object
}

export default translate()(FileListRows)
