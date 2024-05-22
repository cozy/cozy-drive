import React, { useCallback } from 'react'

import useBreakpoints from 'cozy-ui/transpiled/react/providers/Breakpoints'

import { EmptyDrive } from 'components/Error/Empty'
import Oops from 'components/Error/Oops'
import { useThumbnailSizeContext } from 'lib/ThumbnailSizeContext'
import { FileWithSelection as File } from 'modules/filelist/File'
import { FileList } from 'modules/filelist/FileList'
import FileListBody from 'modules/filelist/FileListBody'
import { FileListHeader } from 'modules/filelist/FileListHeader'
import FileListRowsPlaceholder from 'modules/filelist/FileListRowsPlaceholder'
import LoadMore from 'modules/filelist/LoadMoreV2'
import { useNeedsToWait } from 'modules/folder/hooks/useNeedsToWait'
import { useScrollToTop } from 'modules/folder/hooks/useScrollToTop'
import { useFolderSort } from 'modules/navigation/duck'
import SelectionBar from 'modules/selection/SelectionBar'

const FolderBody = ({
  folderId,
  queryResults,
  actions,
  onFolderOpen,
  onFileOpen,
  extraColumns,
  canSort,
  refreshFolderContent,
  withFilePath,
  isInSyncFromSharing,
  renderEmptyComponent = () => {
    return <EmptyDrive />
  }
}) => {
  const { isDesktop } = useBreakpoints()

  useScrollToTop(folderId)

  const isError = queryResults.some(query => query.fetchStatus === 'failed')
  const hasData =
    !isError && queryResults.some(query => query.data && query.data.length > 0)
  const isLoading =
    !hasData &&
    queryResults.some(
      query => query.fetchStatus === 'loading' && !query.lastUpdate
    )
  const isEmpty = !isError && !isLoading && !hasData
  const needsToWait = useNeedsToWait({ isLoading })

  const { isBigThumbnail, toggleThumbnailSize } = useThumbnailSizeContext()
  const [sortOrder, setSortOrder] = useFolderSort(folderId)
  const changeSortOrder = useCallback(
    (folderId_legacy, attribute, order) =>
      setSortOrder({ sortAttribute: attribute, sortOrder: order }),
    [setSortOrder]
  )

  return (
    <>
      <SelectionBar actions={actions} />
      <FileList>
        {hasData ? (
          <FileListHeader
            folderId={null}
            canSort={canSort}
            sort={sortOrder}
            onFolderSort={changeSortOrder}
            thumbnailSizeBig={isBigThumbnail}
            toggleThumbnailSize={toggleThumbnailSize}
          />
        ) : null}
        <FileListBody selectionModeActive={false}>
          {isError ? <Oops /> : null}
          {isLoading || needsToWait ? <FileListRowsPlaceholder /> : null}
          {isEmpty ? renderEmptyComponent() : null}
          {hasData && !needsToWait ? (
            <div className={!isDesktop ? 'u-ov-hidden' : ''}>
              {queryResults.map((query, queryIndex) => (
                <React.Fragment key={queryIndex}>
                  {query.data.map(file => {
                    return (
                      <File
                        key={file._id}
                        attributes={file}
                        onFolderOpen={onFolderOpen}
                        onFileOpen={onFileOpen}
                        withFilePath={withFilePath}
                        thumbnailSizeBig={isBigThumbnail}
                        actions={actions}
                        refreshFolderContent={refreshFolderContent}
                        isInSyncFromSharing={isInSyncFromSharing}
                        extraColumns={extraColumns}
                        withSelectionCheckbox
                      />
                    )
                  })}
                  {query.hasMore && <LoadMore fetchMore={query.fetchMore} />}
                </React.Fragment>
              ))}
            </div>
          ) : null}
        </FileListBody>
      </FileList>
    </>
  )
}

export { FolderBody }
