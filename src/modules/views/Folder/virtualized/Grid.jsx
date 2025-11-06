import cx from 'classnames'
import React, { forwardRef } from 'react'

import { useVaultClient } from 'cozy-keys-lib'
import VirtualizedGridListDnd from 'cozy-ui/transpiled/react/GridList/Virtualized/Dnd'

import GridWrapper from './GridWrapper'

import styles from '@/styles/filelist.styl'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import AddFolder from '@/modules/filelist/AddFolder'
import { GridFileWithSelection as GridFile } from '@/modules/filelist/virtualized/GridFile'

const Grid = forwardRef(
  (
    {
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
      currentFolderId,
      onInteractWithFile,
      selectedItems,
      isSelectedItem
    },
    ref
  ) => {
    const vaultClient = useVaultClient()

    return (
      <div
        className="u-h-100"
        ref={ref}
        tabIndex={0}
        style={{ outline: 'none' }}
      >
        <VirtualizedGridListDnd
          components={{
            List: GridWrapper
          }}
          componentProps={{
            Item: {
              className: cx(styles['fil-content-grid-item'])
            }
          }}
          items={items}
          dragProps={dragProps}
          itemRenderer={(file, { isOver }) => (
            <>
              {file.type != 'tempDirectory' ? (
                <RightClickFileMenu
                  key={file?._id}
                  doc={file}
                  actions={actions}
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
                    isOver={isOver}
                    onInteractWithFile={onInteractWithFile}
                  />
                </RightClickFileMenu>
              ) : (
                <AddFolder
                  vaultClient={vaultClient}
                  currentFolderId={currentFolderId}
                  refreshFolderContent={refreshFolderContent}
                />
              )}
            </>
          )}
          endReached={fetchMore}
          context={{ actions, selectedItems, isSelectedItem }}
        />
      </div>
    )
  }
)

Grid.displayName = 'Grid'

export default React.memo(Grid)
