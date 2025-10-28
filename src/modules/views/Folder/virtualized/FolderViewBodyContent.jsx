import React, { useCallback, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import {
  stableSort,
  getComparator
} from 'cozy-ui/transpiled/react/Table/Virtualized/helpers'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Grid from './Grid'
import { secondarySort } from '../helpers'
import { useSyncingFakeFile } from '../useSyncingFakeFile'

import { SHARED_DRIVES_DIR_ID } from '@/constants/config'
import { useShiftSelection } from '@/hooks/useShiftSelection'
import { useViewSwitcherContext } from '@/lib/ViewSwitcherContext'
import { isTypingNewFolderName } from '@/modules/filelist/duck'
import { FolderUnlocker } from '@/modules/folder/components/FolderUnlocker'
import { useCancelable } from '@/modules/move/hooks/useCancelable'
import SelectionBar from '@/modules/selection/SelectionBar'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import Table from '@/modules/views/Folder/virtualized/Table'
import { makeRows, onDrop } from '@/modules/views/Folder/virtualized/helpers'

const FolderViewBodyContent = ({
  currentFolderId,
  displayedFolder,
  actions,
  columns,
  queryResults,
  isEmpty,
  canDrag,
  withFilePath,
  orderProps = {
    sortOrder: {},
    setOrder: () => {}
  }
}) => {
  const folderViewRef = useRef()

  const client = useClient()

  const navigate = useNavigate()

  const { selectAll, selectedItems } = useSelectionContext()
  const { sharedPaths } = useSharingContext()
  const { registerCancelable } = useCancelable()
  const { showAlert } = useAlert()
  const { viewType } = useViewSwitcherContext()
  const { t } = useI18n()
  const IsAddingFolder = useSelector(isTypingNewFolderName)
  const { sortOrder } = orderProps
  const { order, attribute: orderBy } = sortOrder

  const fetchMore = queryResults.find(query => query.hasMore)?.fetchMore

  const isSelectedItem = file => {
    if (file._id === SHARED_DRIVES_DIR_ID) {
      return false
    }
    return selectedItems.some(item => item._id === file._id)
  }

  const { syncingFakeFile } = useSyncingFakeFile({ isEmpty, queryResults })

  const rows = useMemo(
    () => makeRows({ queryResults, IsAddingFolder, syncingFakeFile }),
    [queryResults, IsAddingFolder, syncingFakeFile]
  )

  const sortedRows = useMemo(() => {
    const sortedData = stableSort(rows, getComparator(order, orderBy))
    return secondarySort(sortedData)
  }, [rows, order, orderBy])

  const { setLastInteractedItem, onShiftClick } = useShiftSelection(
    {
      items: sortedRows,
      viewType
    },
    folderViewRef
  )

  const onInteractWithFile = (itemId, event) => {
    setLastInteractedItem(itemId)
    onShiftClick(itemId, event)
  }

  const handleFolderUnlockerDismiss = useCallback(() => {
    navigate('/folder')
  }, [navigate])

  return (
    <FolderUnlocker
      folder={displayedFolder}
      onDismiss={handleFolderUnlockerDismiss}
    >
      <SelectionBar actions={actions} />
      {viewType === 'list' ? (
        <Table
          rows={rows}
          columns={columns}
          dragProps={{
            enabled: canDrag,
            dragId: 'drag-drive',
            onDrop: onDrop({
              client,
              showAlert,
              selectAll,
              registerCancelable,
              sharedPaths,
              t
            })
          }}
          fetchMore={fetchMore}
          selectAll={selectAll}
          isSelectedItem={isSelectedItem}
          selectedItems={selectedItems}
          currentFolderId={currentFolderId}
          withFilePath={withFilePath}
          actions={actions}
          ref={folderViewRef}
          onInteractWithFile={onInteractWithFile}
          orderProps={orderProps}
        />
      ) : (
        <Grid
          items={sortedRows}
          currentFolderId={currentFolderId}
          withFilePath={withFilePath}
          actions={actions}
          fetchMore={fetchMore}
          selectedItems={selectedItems}
          isSelectedItem={isSelectedItem}
          dragProps={{
            enabled: canDrag,
            dragId: 'drag-drive',
            onDrop: onDrop({
              client,
              showAlert,
              selectAll,
              registerCancelable,
              sharedPaths,
              t
            })
          }}
          onInteractWithFile={onInteractWithFile}
          ref={folderViewRef}
        />
      )}
    </FolderUnlocker>
  )
}

export default FolderViewBodyContent
