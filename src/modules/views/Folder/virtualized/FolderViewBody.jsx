import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { useClient } from 'cozy-client'
import { useSharingContext } from 'cozy-sharing'
import { useAlert } from 'cozy-ui/transpiled/react/providers/Alert'
import { useBreakpoints } from 'cozy-ui/transpiled/react/providers/Breakpoints'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import Grid from './Grid'
import { makeColumns } from '../helpers'
import { useSyncingFakeFile } from '../useSyncingFakeFile'

import { EmptyWrapper } from '@/components/Error/Empty'
import Oops from '@/components/Error/Oops'
import { SHARED_DRIVES_DIR_ID } from '@/constants/config'
import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import { useViewSwitcherContext } from '@/lib/ViewSwitcherContext'
import FileListRowsPlaceholder from '@/modules/filelist/FileListRowsPlaceholder'
import { isTypingNewFolderName } from '@/modules/filelist/duck'
import { FolderUnlocker } from '@/modules/folder/components/FolderUnlocker'
import { useCancelable } from '@/modules/move/hooks/useCancelable'
import SelectionBar from '@/modules/selection/SelectionBar'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import AddFolderWrapper from '@/modules/views/Folder/virtualized/AddFolderWrapper'
import Table from '@/modules/views/Folder/virtualized/Table'
import { makeRows, onDrop } from '@/modules/views/Folder/virtualized/helpers'

const FolderViewBody = ({
  currentFolderId,
  displayedFolder,
  queryResults,
  actions,
  canUpload = true,
  canDrag,
  withFilePath = false,
  sortOrder
}) => {
  const client = useClient()
  const { isDesktop } = useBreakpoints()
  const navigate = useNavigate()
  const IsAddingFolder = useSelector(isTypingNewFolderName)
  const { isBigThumbnail } = useThumbnailSizeContext()
  const { selectAll, selectedItems } = useSelectionContext()
  const { sharedPaths } = useSharingContext()
  const { registerCancelable } = useCancelable()
  const { showAlert } = useAlert()
  const { viewType } = useViewSwitcherContext()
  const { t } = useI18n()

  const isSelectedItem = file => {
    if (file._id === SHARED_DRIVES_DIR_ID) {
      return false
    }
    return selectedItems.some(item => item._id === file._id)
  }

  const isInError = queryResults.some(query => query.fetchStatus === 'failed')
  const hasDataToShow =
    !isInError &&
    queryResults.some(query => query.data && query.data.length > 0)
  const isLoading =
    !hasDataToShow &&
    queryResults.some(
      query => query.fetchStatus === 'loading' && !query.lastUpdate
    )
  const fetchMore = queryResults.find(query => query.hasMore)?.fetchMore
  const isEmpty = !isInError && !isLoading && !hasDataToShow
  const { syncingFakeFile } = useSyncingFakeFile({ isEmpty, queryResults })
  const columns = useMemo(() => makeColumns(isBigThumbnail), [isBigThumbnail])
  const rows = useMemo(
    () => makeRows({ queryResults, IsAddingFolder, syncingFakeFile }),
    [queryResults, IsAddingFolder, syncingFakeFile]
  )

  /**
   *  Since we are not able to restore the scroll correctly,
   * and force the scroll to top every time we change the
   * current folder. This is to avoid this kind of weird
   * behavior:
   * - If I go to a sub-folder, if this subfolder has a lot
   * of data and I scrolled down until the bottom. If I go
   * back, then my folder will also be scrolled down.
   *
   * This is an ugly hack, yeah.
   * */
  useEffect(() => {
    if (isDesktop) {
      const scrollable = document.querySelectorAll(
        '[data-testid=fil-content-body]'
      )[0]
      if (scrollable) {
        scrollable.scroll({ top: 0 })
      }
    } else {
      window.scroll({ top: 0 })
    }
  }, [currentFolderId, isDesktop])

  /**
   * When we mount the component when we already have data in cache,
   * the mount is time consuming since we'll render at least 100 lines
   * of File.
   *
   * React seems to batch together the fact that :
   * - we change a route
   * - we want to render 100 files
   * resulting in a non smooth transition between views (Drive / Recent / ...)
   *
   * In order to bypass this batch, we use a state to first display a much
   * more simpler component and then the files
   */
  const [needsToWait, setNeedsToWait] = useState(true)
  useEffect(() => {
    let timeout = null
    if (!isLoading) {
      timeout = setTimeout(() => {
        setNeedsToWait(false)
      }, 50)
    }
    return () => clearTimeout(timeout)
  }, [isLoading])

  const handleFolderUnlockerDismiss = useCallback(() => {
    navigate('/folder')
  }, [navigate])

  const showTable = hasDataToShow && !needsToWait

  return (
    <FolderUnlocker
      folder={displayedFolder}
      onDismiss={handleFolderUnlockerDismiss}
    >
      <SelectionBar actions={actions} />
      {IsAddingFolder && !showTable && (
        <AddFolderWrapper columns={columns} currentFolderId={currentFolderId} />
      )}
      {isInError && <Oops />}
      {(needsToWait || isLoading) && <FileListRowsPlaceholder />}
      {/* TODO FolderViewBody should not have the responsability to chose
      which empty component to display. It should be done by the "view" itself.
      But adding a new prop like <FolderViewBody emptyComponent={}
      is not good enought too */}
      {displayedFolder !== null && !IsAddingFolder && isEmpty && (
        <EmptyWrapper
          currentFolderId={currentFolderId}
          displayedFolder={displayedFolder}
          canUpload={canUpload}
        />
      )}
      {showTable &&
        (viewType === 'list' ? (
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
        ))}
    </FolderUnlocker>
  )
}

export default FolderViewBody
