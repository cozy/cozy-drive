import { CozyFile } from 'models'
import React from 'react'

import { useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderPickerContentExplorer } from 'components/FolderPicker/FolderPickerContentExplorer'
import { FolderPickerContentLoadMore } from 'components/FolderPicker/FolderPickerContentLoadMore'
import { FolderPickerContentLoader } from 'components/FolderPicker/FolderPickerContentLoader'
import { ROOT_DIR_ID } from 'constants/config'
import { DumbFile as File } from 'modules/filelist/File'
import { buildOnlyFolderQuery } from 'modules/queries'
import { buildSharedDrivesQuery } from 'modules/views/Folder/queries/fetchSharedDrives'

const FolderPickerContentRoot = ({ navigateTo }) => {
  const rootFolderQuery = buildOnlyFolderQuery(ROOT_DIR_ID)
  const { data: rootData, fetchStatus: rootFetchStatus } = useQuery(
    rootFolderQuery.definition,
    rootFolderQuery.options
  )
  const { t } = useI18n()

  const sharedDrivesQuery = buildSharedDrivesQuery({
    sortAttribute: 'name',
    sortOrder: 'asc'
  })
  const {
    data: sharedDrivesData,
    fetchStatus: sharedDrivesFetchStatus,
    hasMore,
    fetchMore
  } = useQuery(sharedDrivesQuery.definition, sharedDrivesQuery.options)

  const fetchStatus = [rootFetchStatus, sharedDrivesFetchStatus]
  const currentFetchStatus = fetchStatus.some(status => status === 'loading')
    ? 'loading'
    : fetchStatus.some(status => status === 'failed')
    ? 'failed'
    : fetchStatus.every(status => status === 'loaded')
    ? 'loaded'
    : 'pending'

  const files = [rootData, ...sharedDrivesData].filter(file => {
    return (
      file?.cozyMetadata?.createdByApp === 'nextcloud' ||
      file?._id === ROOT_DIR_ID
    )
  })

  const handleFolderOpen = async folder => {
    if (folder._id === ROOT_DIR_ID) {
      navigateTo(folder)
    }
  }

  const handleFileOpen = async ({ file }) => {
    if (file.cozyMetadata?.createdByApp === 'nextcloud') {
      navigateTo({
        _type: 'io.cozy.remote.nextcloud.files',
        path: '/',
        name: CozyFile.splitFilename(file).filename,
        cozyMetadata: {
          sourceAccount: file.cozyMetadata?.sourceAccount
        }
      })
    }
  }

  return (
    <FolderPickerContentExplorer>
      <FolderPickerContentLoader
        fetchStatus={currentFetchStatus}
        hasNoData={files.length === 0}
      >
        {files.map(file => (
          <File
            key={file.id}
            attributes={{
              ...file,
              name:
                file.id === ROOT_DIR_ID
                  ? t('FolderPickerContentRoot.myDrive')
                  : CozyFile.splitFilename(file).filename
            }}
            onFolderOpen={handleFolderOpen}
            onFileOpen={handleFileOpen}
            disableSelection
          />
        ))}
        <FolderPickerContentLoadMore hasMore={hasMore} fetchMore={fetchMore} />
      </FolderPickerContentLoader>
    </FolderPickerContentExplorer>
  )
}

export { FolderPickerContentRoot }
