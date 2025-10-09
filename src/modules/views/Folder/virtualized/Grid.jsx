import cx from 'classnames'
import React, { useRef } from 'react'

import { useVaultClient } from 'cozy-keys-lib'
import VirtualizedGridList from 'cozy-ui/transpiled/react/GridList/Virtualized'
import virtuosoComponents from 'cozy-ui/transpiled/react/GridList/Virtualized/virtuosoComponents'

import GridWrapper from './GridWrapper'

import styles from '@/styles/filelist.styl'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import { useShiftArrowsSelection } from '@/hooks/useShiftArrowsSelection'
import AddFolder from '@/modules/filelist/AddFolder'
import GridFile2 from '@/modules/filelist/virtualized/GridFile2'

const Item = ({ className, children, ...props }) => {
  return (
    <div
      {...props}
      className={cx(className, 'u-p-half u-ta-center')}
      style={{
        padding: '0.5rem',
        width: '135px',
        display: 'block',
        flex: 'none',
        alignContent: 'stretch',
        boxSizing: 'border-box'
      }}
    >
      {children}
    </div>
  )
}

const memoItem = React.memo(Item)

const Grid = ({
  items,
  actions,
  withFilePath = false,
  refreshFolderContent,
  isSharingContextEmpty,
  isSharingShortcut = null,
  isReferencedByShareInSharingContext,
  sharingsValue,
  fetchMore,
  dragProps,
  currentFolderId
}) => {
  const vaultClient = useVaultClient()
  const gridRef = useRef()
  // useShiftArrowsSelection({ items, viewType: 'grid' }, gridRef)

  console.info(' ')
  console.info('items :', items)
  console.info(' ')

  return (
    <div
      className="u-h-100"
      ref={gridRef}
      tabIndex={0}
      style={{ outline: 'none' }}
    >
      <VirtualizedGridList
        items={items}
        // context={actions}
        components={{
          ...virtuosoComponents,
          Item: Item
        }}
        endReached={fetchMore}
        itemContent={index => {
          const item = items[index]
          return (
            <GridFile2
              key={item?._id}
              attributes={item}
              withSelectionCheckbox
              withFilePath={withFilePath}
              actions={actions}
              refreshFolderContent={refreshFolderContent}
              isInSyncFromSharing={
                !isSharingContextEmpty &&
                isSharingShortcut?.(item) &&
                isReferencedByShareInSharingContext(item, sharingsValue)
              }
              onContextMenu={null}
              // isOver={isOver}
              // fileIndex={file.index !== undefined ? file.index : index}
            />
          )
        }}
        // components={{
        //   ...virtuosoComponents
        //   // List: GridWrapper,
        // }}
        // components={{
        //   List: GridWrapper
        // }}
        // componentProps={{
        //   Item: {
        //     className: cx(styles['fil-content-grid-item'])
        //   }
        // }}
        // dragProps={dragProps}
        // itemRenderer={(file, { isOver }, index) => (
        //   <>
        //     {file.type != 'tempDirectory' ? (
        //       <RightClickFileMenu
        //         key={file?._id}
        //         doc={file}
        //         actions={actions.filter(action => !action.selectAllItems)}
        //       >
        //         <GridFile
        //           key={file?._id}
        //           attributes={file}
        //           withSelectionCheckbox
        //           withFilePath={withFilePath}
        //           actions={actions}
        //           refreshFolderContent={refreshFolderContent}
        //           isInSyncFromSharing={
        //             !isSharingContextEmpty &&
        //             isSharingShortcut?.(file) &&
        //             isReferencedByShareInSharingContext(file, sharingsValue)
        //           }
        //           isOver={isOver}
        //           fileIndex={file.index !== undefined ? file.index : index}
        //         />
        //       </RightClickFileMenu>
        //     ) : (
        //       <AddFolder
        //         vaultClient={vaultClient}
        //         currentFolderId={currentFolderId}
        //       />
        //     )}
        //   </>
        // )}
      />
    </div>
  )
}

export default React.memo(Grid)
