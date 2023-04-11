import React, { useCallback, useContext, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import get from 'lodash/get'

import { useClient, useCapabilities } from 'cozy-client'
import { useVaultClient, VaultUnlocker } from 'cozy-keys-lib'
import { isSharingShortcut } from 'cozy-client/dist/models/file'
import useBreakpoints from 'cozy-ui/transpiled/react/hooks/useBreakpoints'

import { ThumbnailSizeContext } from 'drive/lib/ThumbnailSizeContext'
import { useRouter } from 'drive/lib/RouterContext'
import AcceptingSharingContext from 'drive/lib/AcceptingSharingContext'
import { FileList } from 'drive/web/modules/filelist/FileList'
import FileListBody from 'drive/web/modules/filelist/FileListBody'
import AddFolder from 'drive/web/modules/filelist/AddFolder'
import FileListHeader from 'drive/web/modules/filelist/FileListHeader'
import MobileFileListHeader from 'drive/web/modules/filelist/MobileFileListHeader'
import Oops from 'components/Error/Oops'
import { EmptyDrive, EmptyTrash } from 'components/Error/Empty'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'
import LoadMore from 'drive/web/modules/filelist/LoadMoreV2'
import { FileWithSelection as File } from 'drive/web/modules/filelist/File'
import { useFolderSort } from 'drive/web/modules/navigation/duck'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'
import { TRASH_DIR_ID } from 'drive/constants/config'
import createFileOpeningHandler from 'drive/web/modules/views/Folder/createFileOpeningHandler'
import { useSyncingFakeFile } from './useSyncingFakeFile'
import { isReferencedByShareInSharingContext } from 'drive/web/modules/views/Folder/syncHelpers'
import { isOfficeEnabled } from 'drive/web/modules/views/OnlyOffice/helpers'
import { isEncryptedFolder } from 'drive/lib/encryption'
import { useWebviewIntent } from 'cozy-intent'

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
  navigateToFolder,
  navigateToFile,
  refreshFolderContent = null,
  extraColumns
}) => {
  const { isDesktop } = useBreakpoints()
  const { router } = useRouter()
  const client = useClient()
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

  const { isBigThumbnail, toggleThumbnailSize } =
    useContext(ThumbnailSizeContext)
  const { sharingsValue } = useContext(AcceptingSharingContext)
  const [sortOrder, setSortOrder] = useFolderSort(currentFolderId)
  const vaultClient = useVaultClient()
  const webviewIntent = useWebviewIntent()

  const changeSortOrder = useCallback(
    (folderId_legacy, attribute, order) =>
      setSortOrder({ sortAttribute: attribute, sortOrder: order }),
    [setSortOrder]
  )

  const { capabilities } = useCapabilities(client)
  const isFlatDomain = get(capabilities, 'flat_subdomains')
  const dispatch = useDispatch()

  const handleFileOpen = useCallback(
    ({ event, file, isAvailableOffline }) => {
      return createFileOpeningHandler({
        client,
        isFlatDomain,
        dispatch,
        navigateToFile,
        replaceCurrentUrl: url => (window.location.href = url),
        openInNewTab: url => window.open(url, '_blank'),
        routeTo: url => router.push(url),
        isOfficeEnabled: isOfficeEnabled(isDesktop),
        webviewIntent
      })({
        event,
        file,
        isAvailableOffline
      })
    },
    [
      client,
      dispatch,
      navigateToFile,
      isFlatDomain,
      router,
      webviewIntent,
      isDesktop
    ]
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

  const [shouldUnlock, setShouldUnlock] = useState(true)
  useEffect(() => {
    const checkLock = async () => {
      const isLocked = await vaultClient.isLocked()
      setShouldUnlock(isLocked)
    }
    if (isEncFolder) {
      checkLock()
    }
  }, [vaultClient, isEncFolder, shouldUnlock])
  if (isEncFolder && shouldUnlock) {
    return (
      <VaultUnlocker
        onDismiss={() => {
          setShouldUnlock(false)
          return router.push(`/folder`)
        }}
        onUnlock={() => setShouldUnlock(false)}
      />
    )
  } else {
    return (
      <>
        <SelectionBar actions={actions} />
        <FileList>
          {hasDataToShow && (
            <>
              <MobileFileListHeader
                folderId={null}
                canSort={canSort}
                sort={sortOrder}
                onFolderSort={changeSortOrder}
                thumbnailSizeBig={isBigThumbnail}
                toggleThumbnailSize={toggleThumbnailSize}
              />
              <FileListHeader
                folderId={null}
                canSort={canSort}
                sort={sortOrder}
                onFolderSort={changeSortOrder}
                thumbnailSizeBig={isBigThumbnail}
                toggleThumbnailSize={toggleThumbnailSize}
                extraColumns={extraColumns}
              />
            </>
          )}
          <FileListBody selectionModeActive={false}>
            <AddFolder
              vaultClient={vaultClient}
              refreshFolderContent={refreshFolderContent}
              extraColumns={extraColumns}
            />
            {isInError && <Oops />}
            {(needsToWait || isLoading) && <FileListRowsPlaceholder />}
            {/* TODO FolderViewBody should not have the responsability to chose
          which empty component to display. It should be done by the "view" itself.
          But adding a new prop like <FolderViewBody emptyComponent={}
          is not good enought too */}
            {isEmpty && currentFolderId !== TRASH_DIR_ID && (
              <EmptyDrive isEncrypted={isEncFolder} canUpload={canUpload} />
            )}
            {isEmpty && currentFolderId === TRASH_DIR_ID && (
              <EmptyTrash canUpload={canUpload} />
            )}
            {hasDataToShow && !needsToWait && (
              <div className={!isDesktop ? 'u-ov-hidden' : ''}>
                <>
                  {syncingFakeFile && (
                    <File
                      attributes={syncingFakeFile}
                      withSelectionCheckbox={false}
                      onFolderOpen={() => {}}
                      onFileOpen={() => {}}
                      actions={[]}
                      isInSyncFromSharing={true}
                      extraColumns={extraColumns}
                    />
                  )}
                  {queryResults.map((query, queryIndex) => (
                    <React.Fragment key={queryIndex}>
                      {query.data.map(file => (
                        <File
                          key={file._id}
                          attributes={file}
                          withSelectionCheckbox
                          onFolderOpen={navigateToFolder}
                          onFileOpen={handleFileOpen}
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
                        />
                      ))}
                      {query.hasMore && (
                        <LoadMore fetchMore={query.fetchMore} />
                      )}
                    </React.Fragment>
                  ))}
                </>
              </div>
            )}
          </FileListBody>
        </FileList>
      </>
    )
  }
}

export default FolderViewBody
