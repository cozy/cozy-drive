import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { makeColumns } from '../helpers'
import { useSyncingFakeFile } from '../useSyncingFakeFile'

import Oops from '@/components/Error/Oops'
import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import FileListRowsPlaceholder from '@/modules/filelist/FileListRowsPlaceholder'
import { isTypingNewFolderName } from '@/modules/filelist/duck'
import { FolderUnlocker } from '@/modules/folder/components/FolderUnlocker'
import SelectionBar from '@/modules/selection/SelectionBar'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'
import EmptyContent from '@/modules/views/Folder/virtualized/EmptyContent'
import Table from '@/modules/views/Folder/virtualized/Table'
import { makeRows } from '@/modules/views/Folder/virtualized/helpers'

const FolderViewBody = ({
  currentFolderId,
  displayedFolder,
  queryResults,
  actions,
  canUpload = true,
  withFilePath = false
}) => {
  const { isDesktop } = useBreakpoints()
  const navigate = useNavigate()
  const IsAddingFolder = useSelector(isTypingNewFolderName)
  const { isBigThumbnail } = useThumbnailSizeContext()
  const { toggleSelectedItem, selectAll, selectedItems } = useSelectionContext()

  const isSelectedItem = file => {
    return selectedItems.some(item => item.id === file.id)
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
      {isInError && <Oops />}
      {(needsToWait || isLoading) && <FileListRowsPlaceholder />}
      {/* TODO FolderViewBody should not have the responsability to chose
      which empty component to display. It should be done by the "view" itself.
      But adding a new prop like <FolderViewBody emptyComponent={}
      is not good enought too */}
      <EmptyContent
        displayedFolder={displayedFolder}
        isEmpty={isEmpty}
        currentFolderId={currentFolderId}
        canUpload={canUpload}
      />
      {showTable && (
        <Table
          rows={rows}
          columns={columns}
          fetchMore={fetchMore}
          selectAll={selectAll}
          toggleSelectedItem={toggleSelectedItem}
          isSelectedItem={isSelectedItem}
          selectedItems={selectedItems}
          currentFolderId={currentFolderId}
          withFilePath={withFilePath}
          actions={actions}
        />
      )}
    </FolderUnlocker>
  )
}

export default FolderViewBody
