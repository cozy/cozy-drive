/* global __TARGET__ */
import React, { useCallback, useState, useContext } from 'react'
import { useQuery, Q } from 'cozy-client'

import SharingProvider from 'cozy-sharing'
import {
  ThumbnailSizeContext,
  ThumbnailSizeContextProvider
} from 'drive/lib/ThumbnailSizeContext'
import { ModalStack, ModalContextProvider } from 'drive/lib/ModalContext'

import SelectionBar from 'drive/web/modules/selection/SelectionBar'
import Dropzone from 'drive/web/modules/upload/Dropzone'
import Main from 'drive/web/modules/layout/Main'
import Topbar from 'drive/web/modules/layout/Topbar'
import Toolbar from 'drive/web/modules/drive/Toolbar.jsx'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'

import { FileListv2 } from 'drive/web/modules/filelist/FileList'
import { ConnectedFileListBodyV2 as FileListBodyV2 } from 'drive/web/modules/filelist/FileListBody'
import AddFolder from 'drive/web/modules/filelist/AddFolder'
import FileListHeader from 'drive/web/modules/filelist/FileListHeader'
import MobileFileListHeader from 'drive/web/modules/filelist/MobileFileListHeader'
import Oops from 'components/Error/Oops'
import { EmptyDrive } from 'components/Error/Empty'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'
import { isMobileApp } from 'cozy-device-helper'
import { FileV2 as File } from 'drive/web/modules/filelist/File'
import LoadMore from 'drive/web/modules/filelist/LoadMoreV2'
import Breadcrumb from './Breadcrumb'

const buildQuery = ({ currentFolderId, type, sortAttribute, sortOrder }) => ({
  definition: () =>
    Q('io.cozy.files')
      .where({
        dir_id: currentFolderId,
        _id: { $ne: TRASH_DIR_ID },
        type
      })
      .indexFields(['dir_id', 'type', sortAttribute])
      .sortBy([
        { dir_id: sortOrder },
        { type: sortOrder },
        { [sortAttribute]: sortOrder }
      ]),
  options: {
    as: `${type}-${currentFolderId}-${sortAttribute}-${sortOrder}`
  }
})

const DriveView = ({ params, router, children }) => {
  const { isBigThumbnail, toggleThumbnailSize } = useContext(
    ThumbnailSizeContext
  )
  const { folderId } = params
  const [sortOrder, setSortOder] = useState({ attribute: 'name', order: 'asc' })
  const currentFolderId = folderId || ROOT_DIR_ID

  const folderQuery = buildQuery({
    currentFolderId,
    type: 'directory',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })
  const fileQuery = buildQuery({
    currentFolderId,
    type: 'file',
    sortAttribute: sortOrder.attribute,
    sortOrder: sortOrder.order
  })

  const foldersResult = useQuery(folderQuery.definition, folderQuery.options)
  const filesResult = useQuery(fileQuery.definition, fileQuery.options)

  const navigateToFolder = useCallback(folderId => {
    router.push(`/v2/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/v2/${currentFolderId}/file/${file.id}`)
  })

  const changeSortOrder = useCallback((folderId_legacy, attribute, order) =>
    setSortOder({ attribute, order })
  )

  const isInError =
    foldersResult.fetchStatus === 'error' || filesResult.fetchStatus === 'error'
  const hasDataToShow =
    !isInError &&
    ((foldersResult.data && foldersResult.data.length > 0) ||
      (filesResult.data && filesResult.data.length > 0))
  const isLoading =
    !hasDataToShow &&
    foldersResult.fetchStatus === 'loading' &&
    filesResult.fetchStatus === 'loading'
  const isEmpty = !isLoading && !hasDataToShow

  return (
    <Main>
      <ModalStack />
      <Topbar>
        <Breadcrumb
          currentFolderId={currentFolderId}
          navigateToFolder={navigateToFolder}
        />
        {false && (
          <Toolbar
            folderId={null}
            canUpload={true}
            canCreateFolder={true}
            disabled={false}
          />
        )}
      </Topbar>
      <Dropzone
        role="main"
        disabled={__TARGET__ === 'mobile'}
        displayedFolder={null}
      >
        {false && <SelectionBar actions={[]} />}
        <FileListv2>
          <MobileFileListHeader
            folderId={null}
            canSort={true}
            sort={sortOrder}
            onFolderSort={changeSortOrder}
            thumbnailSizeBig={isBigThumbnail}
            toggleThumbnailSize={toggleThumbnailSize}
          />
          <FileListHeader
            folderId={null}
            canSort={true}
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
                {foldersResult.data.map(file => (
                  <File
                    key={file._id}
                    attributes={file}
                    displayedFolder={null}
                    actions={{}}
                    isRenaming={false}
                    onFolderOpen={navigateToFolder}
                    onFileOpen={navigateToFile}
                    withSelectionCheckbox={true}
                    withFilePath={false}
                    withSharedBadge={true}
                    isFlatDomain={true}
                    thumbnailSizeBig={isBigThumbnail}
                  />
                ))}
                {foldersResult.hasMore && (
                  <LoadMore fetchMore={foldersResult.fetchMore} />
                )}
                {filesResult.data.map(file => (
                  <File
                    key={file._id}
                    attributes={file}
                    displayedFolder={null}
                    actions={{}}
                    isRenaming={false}
                    onFolderOpen={navigateToFolder}
                    onFileOpen={navigateToFile}
                    withSelectionCheckbox={true}
                    withFilePath={false}
                    withSharedBadge={true}
                    isFlatDomain={true}
                    thumbnailSizeBig={isBigThumbnail}
                  />
                ))}
                {filesResult.hasMore && (
                  <LoadMore fetchMore={filesResult.fetchMore} />
                )}
              </div>
            )}
          </FileListBodyV2>
        </FileListv2>
        {children}
      </Dropzone>
    </Main>
  )
}

const DriveViewWithProvider = props => (
  <SharingProvider doctype="io.cozy.files" documentType="Files">
    <ThumbnailSizeContextProvider>
      <ModalContextProvider>
        <DriveView {...props} />
      </ModalContextProvider>
    </ThumbnailSizeContextProvider>
  </SharingProvider>
)

export default DriveViewWithProvider
