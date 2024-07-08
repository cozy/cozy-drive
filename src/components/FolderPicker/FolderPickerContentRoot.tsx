import React from 'react'

import { useQuery } from 'cozy-client'
import { useI18n } from 'cozy-ui/transpiled/react/providers/I18n'

import { FolderPickerContentExplorer } from 'components/FolderPicker/FolderPickerContentExplorer'
import { FolderPickerContentLoadMore } from 'components/FolderPicker/FolderPickerContentLoadMore'
import { FolderPickerContentLoader } from 'components/FolderPicker/FolderPickerContentLoader'
import { computeNextcloudRootFolder } from 'components/FolderPicker/helpers'
import { ROOT_DIR_ID } from 'constants/config'
import { DumbFile as File } from 'modules/filelist/File'
import { buildSharedDrivesQuery } from 'modules/views/Folder/queries/fetchSharedDrives'
import { buildOnlyFolderQuery } from 'queries'

interface Props {
  navigateTo: (folder?: import('./types').File) => void
}

const FolderPickerContentRoot: React.FC<Props> = ({ navigateTo }) => {
  const { t } = useI18n()

  const rootFolderQuery = buildOnlyFolderQuery(ROOT_DIR_ID)
  const { data: rootData, fetchStatus: rootFetchStatus } = useQuery(
    rootFolderQuery.definition,
    rootFolderQuery.options
  ) as unknown as {
    data?: import('./types').IOCozyFileWithExtra
    fetchStatus: string
  }

  const sharedDrivesQuery = buildSharedDrivesQuery({
    sortAttribute: 'name',
    sortOrder: 'asc'
  })
  const {
    data: sharedDrivesData,
    fetchStatus: sharedDrivesFetchStatus,
    hasMore,
    fetchMore
  } = useQuery(
    sharedDrivesQuery.definition,
    sharedDrivesQuery.options
  ) as unknown as {
    data?: import('./types').IOCozyFileWithExtra[]
    fetchStatus: string
    hasMore: boolean
    fetchMore: () => void
  }

  const fetchStatus = [rootFetchStatus, sharedDrivesFetchStatus]
  const currentFetchStatus = fetchStatus.some(status => status === 'loading')
    ? 'loading'
    : fetchStatus.some(status => status === 'failed')
    ? 'failed'
    : fetchStatus.every(status => status === 'loaded')
    ? 'loaded'
    : 'pending'

  const files = [
    ...(rootData ? [rootData] : []),
    ...(sharedDrivesData ?? [])
  ].filter(
    file =>
      file.cozyMetadata?.createdByApp === 'nextcloud' ||
      file._id === ROOT_DIR_ID
  )

  const handleFolderOpen = (
    folder: import('./types').IOCozyFileWithExtra
  ): void => {
    if (folder._id === ROOT_DIR_ID) {
      navigateTo(folder)
    }
  }

  const handleFileOpen = ({
    file
  }: {
    file: import('./types').IOCozyFileWithExtra
  }): void => {
    if (
      file.cozyMetadata?.createdByApp === 'nextcloud' &&
      file.cozyMetadata.sourceAccount
    ) {
      const nextcloudRootFolder = computeNextcloudRootFolder({
        sourceAccount: file.cozyMetadata.sourceAccount,
        instanceName: file.metadata.instanceName
      })
      navigateTo(nextcloudRootFolder)
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
                  : `${file.metadata.instanceName ?? ''} (Nextcloud)`
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
