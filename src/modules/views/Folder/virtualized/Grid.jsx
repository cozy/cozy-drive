import cx from 'classnames'
import React from 'react'

import VirtualizedGridList from 'cozy-ui/transpiled/react/GridList/Virtualized'

import GridWrapper from './GridWrapper'

import styles from '@/styles/filelist.styl'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import { GridFileWithSelection as GridFile } from '@/modules/filelist/virtualized/GridFile'

const Grid = ({
  items,
  actions,
  withFilePath = false,
  refreshFolderContent,
  isSharingContextEmpty,
  isSharingShortcut = null,
  isReferencedByShareInSharingContext,
  sharingsValue,
  fetchMore
}) => {
  return (
    <VirtualizedGridList
      components={{
        List: GridWrapper,
        Item: ({ children }) => (
          <div className={cx(styles['fil-content-grid-item'])}>{children}</div>
        )
      }}
      items={items}
      itemRenderer={file => (
        <RightClickFileMenu
          key={file?._id}
          doc={file}
          actions={actions.filter(action => !action.selectAllItems)}
        >
          <GridFile
            key={file?._id}
            attributes={file}
            withSelectionCheckbox
            withFilePath={withFilePath}
            actions={actions}
            refreshFolderContent={refreshFolderContent}
            isInSyncFromSharing={
              !isSharingContextEmpty &&
              isSharingShortcut?.(file) &&
              isReferencedByShareInSharingContext(file, sharingsValue)
            }
          />
        </RightClickFileMenu>
      )}
      endReached={fetchMore}
    />
  )
}

export default React.memo(Grid)
