import cx from 'classnames'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useVaultClient } from 'cozy-keys-lib'
import VirtuosoTable from 'cozy-ui/transpiled/react/Table/Virtuoso/Virtuoso'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { columns, columnsMobile, secondarySort } from './helpers'
import { useSyncingFakeFile } from './useSyncingFakeFile'

import styles from '@/styles/filelist.styl'

import { EmptyDrive, EmptyTrash } from '@/components/Error/Empty'
import Oops from '@/components/Error/Oops'
import { TRASH_DIR_ID } from '@/constants/config'
import AcceptingSharingContext from '@/lib/AcceptingSharingContext'
import { FabContext } from '@/lib/FabProvider'
import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import { isEncryptedFolder } from '@/lib/encryption'
import AddFolder from '@/modules/filelist/AddFolder'
import { FileList } from '@/modules/filelist/FileList'
import FileListBody from '@/modules/filelist/FileListBody'
import FileListRowsPlaceholder from '@/modules/filelist/FileListRowsPlaceholder'
import CellComp from '@/modules/filelist/cells/CellComp'
import { FolderUnlocker } from '@/modules/folder/components/FolderUnlocker'
import { useFolderSort } from '@/modules/navigation/duck'
import SelectionBar from '@/modules/selection/SelectionBar'
import { useSelectionContext } from '@/modules/selection/SelectionProvider'

const FolderViewBodyVz = ({
  currentFolderId,
  displayedFolder,
  queryResults,
  actions,
  // canSort,
  canUpload = true,
  withFilePath = false,
  refreshFolderContent = null,
  extraColumns,
  canInteractWith
}) => {
  const { isMobile, isDesktop } = useBreakpoints()
  const navigate = useNavigate()

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

  const { isSelectionBarVisible } = useSelectionContext()
  const { isFabDisplayed } = useContext(FabContext)
  const { isBigThumbnail, toggleThumbnailSize } = useThumbnailSizeContext()
  const { sharingsValue } = useContext(AcceptingSharingContext)
  const [sortOrder, setSortOrder] = useFolderSort(currentFolderId)
  const vaultClient = useVaultClient()
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
  const isEmpty = !isInError && !isLoading && !hasDataToShow
  const { syncingFakeFile } = useSyncingFakeFile({ isEmpty, queryResults })
  const isSharingContextEmpty = Object.keys(sharingsValue).length <= 0
  const rows = queryResults.flatMap(el => el.data)
  if (syncingFakeFile) {
    rows.push(syncingFakeFile)
  }
  const isEncFolder = isEncryptedFolder(displayedFolder)

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

  return (
    <FolderUnlocker
      folder={displayedFolder}
      onDismiss={handleFolderUnlockerDismiss}
    >
      <SelectionBar actions={actions} />
      <AddFolder
        vaultClient={vaultClient}
        refreshFolderContent={refreshFolderContent}
        extraColumns={extraColumns}
        currentFolderId={currentFolderId}
      />
      {isInError && <Oops />}
      {(needsToWait || isLoading) && <FileListRowsPlaceholder />}
      {/* TODO FolderViewBody should not have the responsability to chose
      which empty component to display. It should be done by the "view" itself.
      But adding a new prop like <FolderViewBody emptyComponent={}
      is not good enought too */}
      {displayedFolder !== null &&
        isEmpty &&
        currentFolderId !== TRASH_DIR_ID && (
          <EmptyDrive isEncrypted={isEncFolder} canUpload={canUpload} />
        )}
      {displayedFolder !== null &&
        isEmpty &&
        currentFolderId === TRASH_DIR_ID && (
          <EmptyTrash canUpload={canUpload} />
        )}
      {hasDataToShow && !needsToWait && (
        <VirtuosoTable
          rows={rows}
          columns={isDesktop ? columns : columnsMobile}
          defaultOrder={columns[0].id}
          secondarySort={secondarySort}
          onSelectAll={selectAll}
          onSelect={toggleSelectedItem}
          isSelectedItem={isSelectedItem}
          selectedItems={selectedItems}
          componentsProps={{
            rowContent: {
              children: (
                <CellComp
                  withFilePath={withFilePath}
                  refreshFolderContent={refreshFolderContent}
                  canInteractWith={canInteractWith}
                  actions={actions}
                />
              )
            }
          }}
        />
      )}
    </FolderUnlocker>
  )
}

export default FolderViewBodyVz
