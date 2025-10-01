import React, { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Grid from './Grid'
import { useSyncingFakeFile } from '../useSyncingFakeFile'

import Oops from '@/components/Error/Oops'
import { SHARED_DRIVES_DIR_ID } from '@/constants/config'
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
  isInError,
  canDrag,
  withFilePath,
  sortOrder
}) => {
  const client = useClient()

  const navigate = useNavigate()

  const { selectAll, selectedItems } = useSelectionContext()
  const { sharedPaths } = useSharingContext()
  const { registerCancelable } = useCancelable()
  const { showAlert } = useAlert()
  const { viewType } = useViewSwitcherContext()
  const { t } = useI18n()
  const IsAddingFolder = useSelector(isTypingNewFolderName)

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

  const handleFolderUnlockerDismiss = useCallback(() => {
    navigate('/folder')
  }, [navigate])

  return (
    <FolderUnlocker
      folder={displayedFolder}
      onDismiss={handleFolderUnlockerDismiss}
    >
      <SelectionBar actions={actions} />
      {isInError && <Oops />}
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
          sortOrder={sortOrder}
        />
      ) : (
        <Grid
          items={rows}
          currentFolderId={currentFolderId}
          withFilePath={withFilePath}
          actions={actions}
          fetchMore={fetchMore}
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
        />
      )}
    </FolderUnlocker>
  )
}

export default FolderViewBodyContent
