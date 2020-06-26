import React, { useCallback, useContext } from 'react'

import { ThumbnailSizeContext } from 'drive/lib/ThumbnailSizeContext'

import { FileListv2 } from 'drive/web/modules/filelist/FileList'
import { ConnectedFileListBodyV2 as FileListBodyV2 } from 'drive/web/modules/filelist/FileListBody'
import AddFolder from 'drive/web/modules/filelist/AddFolder'
import FileListHeader from 'drive/web/modules/filelist/FileListHeader'
import MobileFileListHeader from 'drive/web/modules/filelist/MobileFileListHeader'
import Oops from 'components/Error/Oops'
import { EmptyDrive } from 'components/Error/Empty'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'
import { isMobileApp } from 'cozy-device-helper'
import LoadMore from 'drive/web/modules/filelist/LoadMoreV2'
import { FileWithSelection as File } from 'drive/web/modules/filelist/File'
import { useFolderSort } from 'drive/web/modules/navigation/duck'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'

const FolderViewBody = ({
  folderId,
  queryResults,
  actions,
  canSort,
  withFilePath = false,
  navigateToFolder,
  navigateToFile
}) => {
  const { isBigThumbnail, toggleThumbnailSize } = useContext(
    ThumbnailSizeContext
  )
  const [sortOrder, setSortOrder] = useFolderSort(folderId)

  const changeSortOrder = useCallback((folderId_legacy, attribute, order) =>
    setSortOrder({ sortAttribute: attribute, sortOrder: order })
  )

  const isInError = queryResults.some(query => query.fetchStatus === 'error')

  const hasDataToShow =
    !isInError &&
    queryResults.some(query => query.data && query.data.length > 0)
  const isLoading = queryResults.some(
    query => query.fetchStatus === 'loading' && !query.lastUpdate
  )

  const isEmpty = !isLoading && !hasDataToShow

  return (
    <>
      <SelectionBar actions={actions} />
      <FileListv2>
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
        />
        <FileListBodyV2 selectionModeActive={false}>
          <AddFolder />
          {isInError && <Oops />}
          {isLoading && <FileListRowsPlaceholder />}
          {isEmpty && <EmptyDrive canUpload={true} />}
          {hasDataToShow && (
            <div className={isMobileApp() ? 'u-ov-hidden' : ''}>
              {queryResults.map((query, queryIndex) => (
                <React.Fragment key={queryIndex}>
                  {query.data.map(file => (
                    <File
                      key={file._id}
                      attributes={file}
                      displayedFolder={null}
                      withSelectionCheckbox={true}
                      withSharedBadge={true}
                      isFlatDomain={true}
                      onFolderOpen={navigateToFolder}
                      onFileOpen={navigateToFile}
                      withFilePath={withFilePath}
                      thumbnailSizeBig={isBigThumbnail}
                      actions={actions}
                    />
                  ))}
                  {query.hasMore && <LoadMore fetchMore={query.fetchMore} />}
                </React.Fragment>
              ))}
            </div>
          )}
        </FileListBodyV2>
      </FileListv2>
    </>
  )
}

export default FolderViewBody
