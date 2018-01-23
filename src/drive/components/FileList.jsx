import React, { PureComponent } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import File, { FilePlaceholder } from '../containers/File'
import LoadMore from './LoadMore'
import { isCordova } from '../mobile/lib/device'

require('intersection-observer') // polyfill for safari

const LIMIT = 30

class FileList extends PureComponent {
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
      this.loadMoreRows(LIMIT)
    }
  }

  updateLoadMoreElement = element => {
    if (this.loadMoreElement) {
      this.intersectionObserver.unobserve(this.loadMoreElement)
    }

    if (element) {
      this.loadMoreElement = React.findDOMNode(element)
      this.intersectionObserver.observe(this.loadMoreElement)
    }
  }

  componentWillUnmount() {
    this.intersectionObserver.disconnect()
  }

  shouldDisplayLoadMore() {
    // We're in /recent
    if (!this.props.displayedFolder) return false
    if (isCordova()) {
      if (this.props.files.length < LIMIT) return false
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
              this.loadMoreRows(LIMIT)
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
          hasNoMoreRows: resp.files.length < LIMIT
        }))
      })
      .catch(() => {
        this.setState(state => ({ ...state, isLoading: false }))
      })
  }

  rowRenderer = ({ index, key }) => {
    const {
      displayedFolder,
      selected = [],
      selectionModeActive,
      onFolderOpen,
      onFileOpen,
      onFileToggle,
      showActionMenu,
      withSelectionCheckbox,
      withFilePath,
      isRenaming,
      renamingFile,
      isAvailableOffline
    } = this.props
    const file = this.props.files[index]
    if (!file) {
      return <FilePlaceholder key={key} />
    }
    const isFileRenaming =
      isRenaming && renamingFile && renamingFile.id === file.id
    const isSelected = selected.find(f => f && f.id === file.id) !== undefined
    return (
      <File
        key={key}
        displayedFolder={displayedFolder}
        selected={isSelected}
        isRenaming={isFileRenaming}
        onFolderOpen={onFolderOpen}
        onFileOpen={onFileOpen}
        onToggle={onFileToggle}
        onShowActionMenu={showActionMenu}
        attributes={file}
        selectionModeActive={selectionModeActive}
        withSelectionCheckbox={withSelectionCheckbox}
        withFilePath={withFilePath}
        isAvailableOffline={isAvailableOffline && isAvailableOffline(file.id)}
      />
    )
  }
}

export default translate()(FileList)
