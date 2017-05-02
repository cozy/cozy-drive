import React, { PureComponent } from 'react'
import { translate } from '../lib/I18n'

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
    this.requestedFiles = {}
    for (var i = 0; i < props.files.length; i++) this.requestedFiles[i] = STATUS_LOADED
  }

  render () {
    const { fileCount, files, selected } = this.props
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={fileCount}
        minimumBatchSize={FETCH_LIMIT}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer>
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
    for (var i = startIndex; i <= stopIndex; i++) this.requestedFiles[i] = STATUS_LOADING
    return this.props.fetchMoreFiles(this.props.displayedFolder.id, startIndex, limit)
      .then(() => {
        for (var i = startIndex; i <= stopIndex; i++) this.requestedFiles[i] = STATUS_LOADED
      })
  }

  rowRenderer = ({ index, key, style }) => {
    const {
      displayedFolder, selected, selectionModeActive, onFileEdit, onFolderOpen, onFileOpen, onFileToggle, showActionMenu
    } = this.props
    const file = this.props.files[index]
    if (!file) {
      return <FilePlaceholder key={key} style={style} />
    }
    return (
      <File
        key={key}
        style={style}
        displayedFolder={displayedFolder}
        selected={selected.find(f => f && f.id === file.id) !== undefined}
        onEdit={onFileEdit}
        onFolderOpen={onFolderOpen}
        onFileOpen={onFileOpen}
        onToggle={onFileToggle}
        onShowActionMenu={showActionMenu}
        attributes={file}
        selectionModeActive={selectionModeActive}
      />
    )
  }
}

export default translate()(FileList)
