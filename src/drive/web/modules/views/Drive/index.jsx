/* global __TARGET__ */
import React, { useCallback, useContext } from 'react'
import { connect } from 'react-redux'
import { useQuery } from 'cozy-client'

import SharingProvider from 'cozy-sharing'
import {
  ThumbnailSizeContext,
  ThumbnailSizeContextProvider
} from 'drive/lib/ThumbnailSizeContext'
import { ModalStack, ModalContextProvider } from 'drive/lib/ModalContext'
import { RouterContextProvider } from 'drive/lib/RouterContext'

import SelectionBar from './SelectionBarWithActions'
import Dropzone from 'drive/web/modules/upload/Dropzone'
import Main from 'drive/web/modules/layout/Main'
import Topbar from 'drive/web/modules/layout/Topbar'
import Toolbar from 'drive/web/modules/drive/Toolbar'
import { ROOT_DIR_ID } from 'drive/constants/config'

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
import Breadcrumb from './Breadcrumb'
import File from './FileWithActions'
import { buildQuery } from 'drive/web/modules/queries'
import { getCurrentFolderId } from 'drive/web/modules/selectors'
import { useFolderSort } from 'drive/web/modules/navigation/duck'

const DriveView = ({ folderId, router, children }) => {
  const { isBigThumbnail, toggleThumbnailSize } = useContext(
    ThumbnailSizeContext
  )
  const currentFolderId = folderId || ROOT_DIR_ID
  const [sortOrder, setSortOrder] = useFolderSort(folderId)

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
    router.push(`/folder/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/folder/${currentFolderId}/file/${file.id}`)
  })

  const changeSortOrder = useCallback((folderId_legacy, attribute, order) =>
    setSortOrder({ sortAttribute: attribute, sortOrder: order })
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
        {/* TODO do not have props hardcoded */}
        <Toolbar canUpload={true} canCreateFolder={true} disabled={false} />
      </Topbar>
      <Dropzone
        role="main"
        disabled={__TARGET__ === 'mobile'}
        displayedFolder={null}
      >
        <SelectionBar documentId={currentFolderId} />
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
      <RouterContextProvider>
        <ModalContextProvider>
          <DriveView {...props} />
        </ModalContextProvider>
      </RouterContextProvider>
    </ThumbnailSizeContextProvider>
  </SharingProvider>
)

export default connect(state => ({
  folderId: getCurrentFolderId(state)
}))(DriveViewWithProvider)
