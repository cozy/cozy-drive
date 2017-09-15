import React, { PureComponent } from 'react'
import { translate } from 'cozy-ui/react/I18n'

import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'
import File, { FilePlaceholder } from '../components/File'

const STATUS_LOADING = 1
const STATUS_LOADED = 2

const FETCH_LIMIT = 50
const ROW_HEIGHT = 50

class FileList extends PureComponent {
  constructor (props) {
    super(props)
    this.resetCache(props.files)
  }

  componentWillReceiveProps (newProps) {
    if (newProps.fileCount !== this.props.fileCount &&
      newProps.files.length !== this.props.files.length) {
      this.resetCache(newProps.files)
    }
  }

  render () {
    const { fileCount, files, selected, withSelectionCheckbox } = this.props
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={fileCount}
        minimumBatchSize={FETCH_LIMIT}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableHeight>
            {({ width, height }) => (
              <List
                ref={registerChild}
                height={height}
                rowCount={fileCount}
                onRowsRendered={onRowsRendered}
                rowHeight={ROW_HEIGHT}
                rowRenderer={this.rowRenderer}
                width={width}
                selected={selected}
                files={files}
                withSelectionCheckbox={withSelectionCheckbox}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }

  isRowLoaded = ({ index }) => {
    // No entry in this map signifies that the row has never been loaded before
    // An entry (either LOADING or LOADED) can be treated as loaded as far as InfiniteLoader is concerned
    return !!this.requestedFiles[index]
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    const limit = stopIndex - startIndex + 1
    this.flagAsLoading(startIndex, stopIndex)
    return this.props.fetchMoreFiles(this.props.displayedFolder.id, startIndex, limit)
      .then(() => this.flagAsLoaded(startIndex, stopIndex))
  }

  resetCache = files => {
    this.requestedFiles = {}
    this.flagAsLoaded(0, files.length - 1)
  }

  flagAsLoaded = (startIndex, stopIndex) => this.flagFiles(startIndex, stopIndex, STATUS_LOADED)

  flagAsLoading = (startIndex, stopIndex) => this.flagFiles(startIndex, stopIndex, STATUS_LOADING)

  flagFiles = (startIndex, stopIndex, flag) => {
    for (var i = startIndex; i <= stopIndex; i++) this.requestedFiles[i] = flag
  }

  rowRenderer = ({ index, key, style }) => {
    const {
      displayedFolder, selected = [], selectionModeActive, onFolderOpen, onFileOpen, onFileToggle, showActionMenu, withSelectionCheckbox
    } = this.props
    const file = this.props.files[index]
    if (!file) {
      return <FilePlaceholder key={key} style={style} />
    }
    const { isRenaming, renamingFile, isAvailableOffline } = this.props
    const isFileRenaming = isRenaming && renamingFile && renamingFile.id === file.id
    const isSelected = selected.find(f => f && f.id === file.id) !== undefined
    return (
      <File
        key={key}
        style={style}
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
        isAvailableOffline={isAvailableOffline && isAvailableOffline(file.id)}
      />
    )
  }
}

export default translate()(FileList)
