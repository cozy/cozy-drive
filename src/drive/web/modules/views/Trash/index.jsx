import React, { useCallback, useContext } from 'react'

import SharingProvider from 'cozy-sharing'
import { useQuery } from 'cozy-client'
import {
  ThumbnailSizeContext,
  ThumbnailSizeContextProvider
} from 'drive/lib/ThumbnailSizeContext'
import { ModalStack, ModalContextProvider } from 'drive/lib/ModalContext'
import { RouterContextProvider } from 'drive/lib/RouterContext'

import SelectionBar from 'drive/web/modules/selection/SelectionBar'
import Main from 'drive/web/modules/layout/Main'
import Topbar from 'drive/web/modules/layout/Topbar'
import Toolbar from 'drive/web/modules/trash/Toolbar'

import { FileListv2 } from 'drive/web/modules/filelist/FileList'
import { ConnectedFileListBodyV2 as FileListBodyV2 } from 'drive/web/modules/filelist/FileListBody'
import FileListHeader from 'drive/web/modules/filelist/FileListHeader'
import MobileFileListHeader from 'drive/web/modules/filelist/MobileFileListHeader'
import Oops from 'components/Error/Oops'
import { EmptyDrive } from 'components/Error/Empty'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'
import { isMobileApp } from 'cozy-device-helper'
import LoadMore from 'drive/web/modules/filelist/LoadMoreV2'
import Breadcrumb from './Breadcrumb'
import { FileWithSelection as File } from 'drive/web/modules/filelist/File'
import RealTimeQueries from '../Drive/RealTimeQueries'

import useActions from './useActions'

import { buildTrashQuery } from 'drive/web/modules/queries'

export const TrashView = ({ router, children }) => {
  const { isBigThumbnail, toggleThumbnailSize } = useContext(
    ThumbnailSizeContext
  )

  const trashQuery = buildTrashQuery()

  const result = useQuery(trashQuery.definition, trashQuery.options)
  const isInError = result.fetchStatus === 'error'
  const hasDataToShow = !isInError && (result.data && result.data.length > 0)
  const isLoading = !hasDataToShow && result.fetchStatus === 'loading'
  const isEmpty = !isLoading && !hasDataToShow
  const navigateToFolder = useCallback(folderId => {
    router.push(`/trash/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/trash/file/${file.id}`)
  })

  const actions = useActions()
  return (
    <Main>
      <RealTimeQueries doctype="io.cozy.files" />
      <ModalStack />
      <Topbar>
        <Breadcrumb />
        <Toolbar canUpload={false} canCreateFolder={false} disabled={false} />
      </Topbar>

      <SelectionBar actions={actions} />
      <FileListv2>
        <MobileFileListHeader
          folderId={null}
          canSort={false}
          thumbnailSizeBig={isBigThumbnail}
          toggleThumbnailSize={toggleThumbnailSize}
        />
        <FileListHeader
          folderId={null}
          canSort={false}
          thumbnailSizeBig={isBigThumbnail}
          toggleThumbnailSize={toggleThumbnailSize}
        />
        <FileListBodyV2 selectionModeActive={false}>
          {isInError && <Oops />}
          {isLoading && <FileListRowsPlaceholder />}
          {isEmpty && <EmptyDrive canUpload={false} />}
          {hasDataToShow && (
            <div className={isMobileApp() ? 'u-ov-hidden' : ''}>
              {result.data.map(file => (
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
                  actions={actions}
                />
              ))}
              {result.hasMore && <LoadMore fetchMore={result.fetchMore} />}
            </div>
          )}
        </FileListBodyV2>
      </FileListv2>
      {children}
    </Main>
  )
}

const TrashViewWithProvider = props => (
  <SharingProvider doctype="io.cozy.files" documentType="Files">
    <ThumbnailSizeContextProvider>
      <RouterContextProvider>
        <ModalContextProvider>
          <TrashView {...props} />
        </ModalContextProvider>
      </RouterContextProvider>
    </ThumbnailSizeContextProvider>
  </SharingProvider>
)

export default TrashViewWithProvider
