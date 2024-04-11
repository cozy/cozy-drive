import get from 'lodash/get'
import React, { useCallback, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useClient, useCapabilities } from 'cozy-client'
import { isSharingShortcut } from 'cozy-client/dist/models/file'
import { useWebviewIntent } from 'cozy-intent'
import { useVaultClient, VaultUnlocker } from 'cozy-keys-lib'
import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { useSyncingFakeFile } from './useSyncingFakeFile'
import { EmptyDrive, EmptyTrash } from 'components/Error/Empty'
import Oops from 'components/Error/Oops'
import { TRASH_DIR_ID } from 'constants/config'
import AcceptingSharingContext from 'lib/AcceptingSharingContext'
import { ThumbnailSizeContext } from 'lib/ThumbnailSizeContext'
import { isEncryptedFolder } from 'lib/encryption'
import AddFolder from 'modules/filelist/AddFolder'
import { FileWithSelection as File } from 'modules/filelist/File'
import { FileList } from 'modules/filelist/FileList'
import FileListBody from 'modules/filelist/FileListBody'
import FileListHeader from 'modules/filelist/FileListHeader'
import FileListRowsPlaceholder from 'modules/filelist/FileListRowsPlaceholder'
import LoadMore from 'modules/filelist/LoadMoreV2'
import MobileFileListHeader from 'modules/filelist/MobileFileListHeader'
import { useFolderSort } from 'modules/navigation/duck'
import SelectionBar from 'modules/selection/SelectionBar'
import { FolderTab } from 'modules/views/Folder/FolderTab'
import { FolderTabs } from 'modules/views/Folder/FolderTabs'
import { SharedDrives } from 'modules/views/Folder/SharedDrives'
import createFileOpeningHandler from 'modules/views/Folder/createFileOpeningHandler'
import { isReferencedByShareInSharingContext } from 'modules/views/Folder/syncHelpers'
import { isOfficeEnabled } from 'modules/views/OnlyOffice/helpers'

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
  extraColumns,
  isPublic = false
}) => {
  const { isDesktop } = useBreakpoints()
  const navigate = useNavigate()
  const client = useClient()
  const { pathname } = useLocation()
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
  const { isMobile } = useBreakpoints()
  const [value, setValue] = React.useState(0)
  const handleChange = (_event, newValue) => setValue(newValue)
  const changeSortOrder = useCallback(
    (folderId_legacy, attribute, order) =>
      setSortOrder({ sortAttribute: attribute, sortOrder: order }),
    [setSortOrder]
  )

  const { capabilities } = useCapabilities(client)
  const isFlatDomain = get(capabilities, 'flat_subdomains')

  const handleFileOpen = useCallback(
    ({ event, file }) => {
      return createFileOpeningHandler({
        client,
        isFlatDomain,
        navigateToFile,
        replaceCurrentUrl: url => (window.location.href = url),
        openInNewTab: url => window.open(url, '_blank'),
        routeTo: url => navigate(url),
        isOfficeEnabled: isOfficeEnabled(isDesktop),
        webviewIntent,
        pathname,
        fromPublicFolder: isPublic
      })({
        event,
        file
      })
    },
    [
      client,
      navigateToFile,
      isFlatDomain,
      navigate,
      webviewIntent,
      isDesktop,
      isPublic,
      pathname
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
          return navigate('/folder')
        }}
        onUnlock={() => setShouldUnlock(false)}
      />
    )
  } else {
    return (
      <>
        <SelectionBar actions={actions} />
        <FolderTabs handleChange={handleChange} value={value} />
        <FolderTab value={isMobile ? value : 0} index={0}>
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
                        disableSelection={true}
                      />
                    )}
                    {queryResults.map((query, queryIndex) => (
                      <React.Fragment key={queryIndex}>
                        {query.data.map(file => {
                          return (
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
                          )
                        })}
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
        </FolderTab>
        {isMobile && (
          <FolderTab value={value} index={1}>
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
            <SharedDrives
              handleFileOpen={handleFileOpen}
              navigateToFolder={navigateToFolder}
              isFlatDomain={isFlatDomain}
            />
          </FolderTab>
        )}
      </>
    )
  }
}

export default FolderViewBody
