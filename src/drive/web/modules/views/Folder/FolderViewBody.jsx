import React, { useCallback, useContext, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import get from 'lodash/get'

import { useClient, useCapabilities } from 'cozy-client'
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

// TODO: extraColumns is then passed to 'FileListHeader', 'AddFolder',
// and 'File' (this one from a 'syncingFakeFile' and a normal file).
// It is easy to forget to update one of these components to pass 'extraColumns'.
// It would be ideal to centralize it somewhere.
const FolderViewBody = ({
  currentFolderId,
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
  const { router } = useRouter()
  const { isDesktop } = useBreakpoints()
  const client = useClient()
  const { isBigThumbnail, toggleThumbnailSize } = useContext(
    ThumbnailSizeContext
  )
  const { sharingsValue } = useContext(AcceptingSharingContext)
  const [sortOrder, setSortOrder] = useFolderSort(currentFolderId)

  const changeSortOrder = useCallback(
    (folderId_legacy, attribute, order) =>
      setSortOrder({ sortAttribute: attribute, sortOrder: order }),
    [setSortOrder]
  )

  const capabilities = useCapabilities(client)
  const isFlatDomain = get(
    capabilities,
    'capabilities.data.attributes.flat_subdomains'
  )
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
        routeTo: url => router.push(url)
      })({
        event,
        file,
        isAvailableOffline
      })
    },
    [client, dispatch, navigateToFile, isFlatDomain, router]
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
  useEffect(
    () => {
      let timeout = null
      if (!isLoading) {
        timeout = setTimeout(() => {
          setNeedsToWait(false)
        }, 50)
      }
      return () => clearTimeout(timeout)
    },
    [isLoading]
  )

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
            refreshFolderContent={refreshFolderContent}
            extraColumns={extraColumns}
          />
          {isInError && <Oops />}
          {(needsToWait || isLoading) && <FileListRowsPlaceholder />}
          {/* TODO FolderViewBody should not have the responsability to chose
          which empty component to display. It should be done by the "view" itself.
          But adding a new prop like <FolderViewBody emptyComponent={}
          is not good enought too */}
          {isEmpty &&
            currentFolderId !== TRASH_DIR_ID && (
              <EmptyDrive canUpload={canUpload} />
            )}
          {isEmpty &&
            currentFolderId === TRASH_DIR_ID && (
              <EmptyTrash canUpload={canUpload} />
            )}
          {hasDataToShow &&
            !needsToWait && (
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

export default FolderViewBody
