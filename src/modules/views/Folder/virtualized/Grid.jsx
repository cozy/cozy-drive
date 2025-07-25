import cx from 'classnames'
import React from 'react'

import { useVaultClient } from 'cozy-keys-lib'
import VirtualizedGridListDnd from 'cozy-ui/transpiled/react/GridList/Virtualized/Dnd'

import GridWrapper from './GridWrapper'

import styles from '@/styles/filelist.styl'

import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import AddFolder from '@/modules/filelist/AddFolder'
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
  fetchMore,
  dragProps,
  currentFolderId
}) => {
  const vaultClient = useVaultClient()

  return (
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
      itemRenderer={file => (
        <>
          {file.type != 'tempDirectory' ? (
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
          ) : (
            <AddFolder
              vaultClient={vaultClient}
              currentFolderId={currentFolderId}
            />
          )}
        </>
      )}
      endReached={fetchMore}
      context={actions}
    />
  )
}

export default React.memo(Grid)
