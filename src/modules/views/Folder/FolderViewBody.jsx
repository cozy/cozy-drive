import cx from 'classnames'
import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef
} from 'react'
import { useNavigate } from 'react-router-dom'

import { isSharingShortcut } from 'cozy-client/dist/models/file'
import { useVaultClient } from 'cozy-keys-lib'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useSyncingFakeFile } from './useSyncingFakeFile'

import styles from '@/styles/folder-view.styl'

import { EmptyDrive, EmptyTrash } from '@/components/Error/Empty'
import Oops from '@/components/Error/Oops'
import RightClickFileMenu from '@/components/RightClick/RightClickFileMenu'
import { TRASH_DIR_ID } from '@/constants/config'
import { useShiftArrowsSelection } from '@/hooks/useShiftArrowsSelection'
import AcceptingSharingContext from '@/lib/AcceptingSharingContext'
import { useThumbnailSizeContext } from '@/lib/ThumbnailSizeContext'
import { useViewSwitcherContext } from '@/lib/ViewSwitcherContext'
import { isEncryptedFolder } from '@/lib/encryption'
import AddFolder from '@/modules/filelist/AddFolder'
import { FileWithSelection as File } from '@/modules/filelist/File'
import { FileList } from '@/modules/filelist/FileList'
import FileListBody from '@/modules/filelist/FileListBody'
import { FileListHeader } from '@/modules/filelist/FileListHeader'
import FileListRowsPlaceholder from '@/modules/filelist/FileListRowsPlaceholder'
import LoadMore from '@/modules/filelist/LoadMoreV2'
import { FolderUnlocker } from '@/modules/folder/components/FolderUnlocker'
import { useFolderSort } from '@/modules/navigation/duck'
import SelectionBar from '@/modules/selection/SelectionBar'
import { isReferencedByShareInSharingContext } from '@/modules/views/Folder/syncHelpers'

// TODO: extraColumns is then passed to 'FileListHeader', 'AddFolder',
// and 'File' (this one from a 'syncingFakeFile' and a normal file).
// It is easy to forget to update one of these components to pass 'extraColumns'.
// It would be ideal to centralize it somewhere.
const FolderViewBody = ({
  currentFolderId,
  displayedFolder,
  queryResults,
  actions,
  canSort,
  canUpload = true,
  withFilePath = false,
  refreshFolderContent = null,
  extraColumns
}) => {
  const { isDesktop } = useBreakpoints()
  const navigate = useNavigate()
  const { viewType, switchView } = useViewSwitcherContext()
  const folderViewRef = useRef()

  const allFiles = useMemo(() => {
    const files = []
    queryResults.forEach(query => {
      if (query.data && query.data.length > 0) {
        files.push(...query.data)
      }
    })
    return files
  }, [queryResults])

  useShiftArrowsSelection({ items: allFiles, viewType }, folderViewRef)

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

  const { isBigThumbnail } = useThumbnailSizeContext()
  const { sharingsValue } = useContext(AcceptingSharingContext)
  const [sortOrder, setSortOrder] = useFolderSort(currentFolderId)
  const vaultClient = useVaultClient()
  const changeSortOrder = useCallback(
    (_, attribute, order) => setSortOrder({ attribute, order }),
    [setSortOrder]
  )

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
  const isSharingContextEmpty = Object.keys(sharingsValue).length <= 0

  const { syncingFakeFile } = useSyncingFakeFile({ isEmpty, queryResults })
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

  const FileListBodyWrapper = ({ viewType, children }) => {
    return (
      <div
        className={cx(
          viewType === 'grid' ? styles['fil-folder-body-grid'] : ''
        )}
      >
        {children}
      </div>
    )
  }

  return (
    <FolderUnlocker
      folder={displayedFolder}
      onDismiss={handleFolderUnlockerDismiss}
    >
      <SelectionBar actions={actions} />
      <FileList ref={folderViewRef}>
        {hasDataToShow && (
          <FileListHeader
            folderId={null}
            canSort={canSort}
            sort={sortOrder}
            onFolderSort={changeSortOrder}
            viewType={viewType}
            switchViewType={switchView}
            extraColumns={extraColumns}
          />
        )}
        <FileListBody selectionModeActive={false}>
          {!hasDataToShow && !needsToWait && (
            <FileListBodyWrapper viewType={viewType} isDesktop={isDesktop}>
              <AddFolder
                vaultClient={vaultClient}
                refreshFolderContent={refreshFolderContent}
                extraColumns={extraColumns}
                currentFolderId={currentFolderId}
              />
            </FileListBodyWrapper>
          )}
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
            <FileListBodyWrapper viewType={viewType} isDesktop={isDesktop}>
              <>
                {syncingFakeFile && (
                  <File
                    attributes={syncingFakeFile}
                    withSelectionCheckbox={false}
                    actions={[]}
                    isInSyncFromSharing={true}
                    extraColumns={extraColumns}
                    disableSelection={true}
                  />
                )}
                <AddFolder
                  vaultClient={vaultClient}
                  refreshFolderContent={refreshFolderContent}
                  extraColumns={extraColumns}
                  currentFolderId={currentFolderId}
                />
                {queryResults.map((query, queryIndex) => {
                  if (query.data !== null && query.data.length > 0) {
                    let fileIndex = 0
                    for (let i = 0; i < queryIndex; i++) {
                      if (queryResults[i].data) {
                        fileIndex += queryResults[i].data.length
                      }
                    }

                    return (
                      <React.Fragment key={queryIndex}>
                        {query.data.map((file, localIndex) => {
                          const globalIndex = fileIndex + localIndex
                          return (
                            <RightClickFileMenu
                              key={file._id}
                              doc={file}
                              actions={actions.filter(
                                action => !action.selectAllItems
                              )}
                            >
                              <File
                                key={file._id}
                                attributes={file}
                                withSelectionCheckbox
                                withFilePath={withFilePath}
                                thumbnailSizeBig={isBigThumbnail}
                                actions={actions}
                                refreshFolderContent={refreshFolderContent}
                                isInSyncFromSharing={
                                  !isSharingContextEmpty &&
                                  isSharingShortcut(file) &&
                                  isReferencedByShareInSharingContext(
                                    file,
                                    sharingsValue
                                  )
                                }
                                extraColumns={extraColumns}
                                fileIndex={globalIndex}
                              />
                            </RightClickFileMenu>
                          )
                        })}
                        {query.hasMore && (
                          <LoadMore fetchMore={query.fetchMore} />
                        )}
                      </React.Fragment>
                    )
                  }
                  return null
                })}
              </>
            </FileListBodyWrapper>
          )}
        </FileListBody>
      </FileList>
    </FolderUnlocker>
  )
}

export default FolderViewBody
