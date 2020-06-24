import React, { useCallback, useContext } from 'react'
import { useQuery } from 'cozy-client'
import get from 'lodash/get'
import uniq from 'lodash/uniq'
import keyBy from 'lodash/keyBy'

import SharingProvider from 'cozy-sharing'
import {
  ThumbnailSizeContext,
  ThumbnailSizeContextProvider
} from 'drive/lib/ThumbnailSizeContext'
import { ModalStack, ModalContextProvider } from 'drive/lib/ModalContext'
import { RouterContextProvider } from 'drive/lib/RouterContext'

import SelectionBar from '../SelectionBarWithActions'
import Main from 'drive/web/modules/layout/Main'
import Topbar from 'drive/web/modules/layout/Topbar'
import Toolbar from 'drive/web/modules/drive/Toolbar'

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
import File from '../FileWithActions'
import RealTimeQueries from '../Drive/RealTimeQueries'

import {
  buildRecentQuery,
  buildParentsByIdsQuery
} from 'drive/web/modules/queries'

const useFilesQueryWithPath = query => {
  const result = useQuery(query.definition, query.options)
  const resultData = result.data || []

  const dirIds = uniq(resultData.map(({ dir_id }) => dir_id))
  const parentsQuery = buildParentsByIdsQuery(dirIds)
  const parentsResult = useQuery(parentsQuery.definition, parentsQuery.options)

  let parentsDocsById = {}

  if (parentsResult.fetchStatus === 'loaded' && parentsResult.data.length > 0) {
    parentsDocsById = keyBy(parentsResult.data, '_id')
  }

  return {
    ...result,
    data: resultData.map(file => ({
      ...file,
      displayedPath: get(parentsDocsById[file.dir_id], 'path')
    }))
  }
}

const RecentView = ({ router, children }) => {
  const { isBigThumbnail, toggleThumbnailSize } = useContext(
    ThumbnailSizeContext
  )

  const query = buildRecentQuery()
  const result = useFilesQueryWithPath(query)

  const isInError = result.fetchStatus === 'error'
  const hasDataToShow = !isInError && (result.data && result.data.length > 0)
  const isLoading = !hasDataToShow && result.fetchStatus === 'loading'
  const isEmpty = !isLoading && !hasDataToShow

  const navigateToFolder = useCallback(folderId => {
    router.push(`/folder/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    router.push(`/recent/file/${file.id}`)
  })

  return (
    <Main>
      <RealTimeQueries doctype="io.cozy.files" />
      <ModalStack />
      <Topbar>
        <Breadcrumb />
        <Toolbar canUpload={false} canCreateFolder={false} disabled={false} />
      </Topbar>

      <SelectionBar />
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
                  withFilePath={true}
                  withSharedBadge={true}
                  isFlatDomain={true}
                  thumbnailSizeBig={isBigThumbnail}
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

const RecentViewWithProvider = props => (
  <SharingProvider doctype="io.cozy.files" documentType="Files">
    <ThumbnailSizeContextProvider>
      <RouterContextProvider>
        <ModalContextProvider>
          <RecentView {...props} />
        </ModalContextProvider>
      </RouterContextProvider>
    </ThumbnailSizeContextProvider>
  </SharingProvider>
)

export default RecentViewWithProvider
