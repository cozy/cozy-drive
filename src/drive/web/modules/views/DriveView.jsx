/* global __TARGET__ */
import React, { useCallback, useState } from 'react'
import { useQuery, Q } from 'cozy-client'
import SharingProvider from 'cozy-sharing'
import cx from 'classnames'
import styles from 'drive/styles/filelist.styl'

import Breadcrumb from 'drive/web/modules/navigation/Breadcrumb'
import SelectionBar from 'drive/web/modules/selection/SelectionBar'
import Dropzone from 'drive/web/modules/upload/Dropzone'
import Main from 'drive/web/modules/layout/Main'
import Topbar from 'drive/web/modules/layout/Topbar'
import Toolbar from 'drive/web/modules/drive/Toolbar.jsx'
import { ROOT_DIR_ID, TRASH_DIR_ID } from 'drive/constants/config'

import { FileListv2 } from 'drive/web/modules/filelist/FileList'
import { FileListBodyV2 } from 'drive/web/modules/filelist/FileListBody'
import AddFolder from 'drive/web/modules/filelist/AddFolder'
import {
  FileListHeader,
  MobileHeader
} from 'drive/web/modules/filelist/FileListHeader'
import Oops from 'components/Error/Oops'
import { EmptyDrive } from 'components/Error/Empty'
import FileListRowsPlaceholder from 'drive/web/modules/filelist/FileListRowsPlaceholder'
import { isMobileApp } from 'cozy-device-helper'
import File from 'drive/web/modules/filelist/File'
import LoadMoreV2 from 'drive/web/modules/filelist/LoadMoreV2'

const DriveView = ({ params, router }) => {
  const { folderId } = params
  const [sortOrder, setSortOder] = useState({ attribute: 'name', order: 'asc' })
  const currentFolderId = folderId || ROOT_DIR_ID

  const folderQuery = {
    definition: () =>
      Q('io.cozy.files')
        .where({
          dir_id: currentFolderId,
          _id: { $ne: TRASH_DIR_ID }
        })
        .indexFields(['dir_id', 'type', sortOrder.attribute])
        .sortBy([
          { dir_id: sortOrder.order },
          { type: sortOrder.order },
          { [sortOrder.attribute]: sortOrder.order }
        ]),
    options: {
      as: `folder-${currentFolderId}-${sortOrder.attribute}-${sortOrder.order}`
    }
  }

  const { fetchStatus, data, hasMore, fetchMore } = useQuery(
    folderQuery.definition,
    folderQuery.options
  )

  const navigateToFolder = useCallback(folderId => {
    router.push(`/v2/${folderId}`)
  })

  const navigateToFile = useCallback(file => {
    console.log({ file })
  })

  const changeSortOrder = useCallback((folderId_legacy, attribute, order) =>
    setSortOder({ attribute, order })
  )

  return (
    <SharingProvider doctype="io.cozy.files" documentType="Files">
      <Main>
        <Topbar>
          {false && <Breadcrumb onFolderOpen={null} />}
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
            <MobileHeader
              t={s => s}
              folderId={null}
              canSort={true}
              sort={sortOrder}
              onFolderSort={changeSortOrder}
              thumbnailSizeBig={false}
              toggleThumbnailSize={() => {}}
            />
            <FileListHeader
              t={s => s}
              folderId={null}
              canSort={true}
              sort={sortOrder}
              onFolderSort={changeSortOrder}
              thumbnailSizeBig={false}
              toggleThumbnailSize={() => {}}
            />
            <FileListBodyV2 selectionModeActive={false}>
              <AddFolder />
              {fetchStatus === 'loading' &&
                !data && <FileListRowsPlaceholder />}
              {fetchStatus === 'error' && <Oops />}
              {fetchStatus === 'loaded' &&
                data.length === 0 && <EmptyDrive canUpload={true} />}
              {data &&
                data.length > 0 && (
                  <div className={isMobileApp() ? 'u-ov-hidden' : ''}>
                    {data.map(file => (
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
                      />
                    ))}
                    {hasMore && (
                      <div
                        className={cx(
                          styles['fil-content-row'],
                          styles['fil-content-row--center']
                        )}
                      >
                        <LoadMoreV2 fetchMore={fetchMore} text={'load MOAR'} />
                      </div>
                    )}
                  </div>
                )}
            </FileListBodyV2>
          </FileListv2>
        </Dropzone>
      </Main>
    </SharingProvider>
  )
}

export default DriveView
