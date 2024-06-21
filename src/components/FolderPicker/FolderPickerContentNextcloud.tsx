import React from 'react'

import { useQuery } from 'cozy-client'
import { NextcloudFile } from 'cozy-client/types/types'

import { FolderPickerContentExplorer } from 'components/FolderPicker/FolderPickerContentExplorer'
import { FolderPickerContentLoader } from 'components/FolderPicker/FolderPickerContentLoader'
import { isInvalidMoveTarget } from 'components/FolderPicker/helpers'
import { DumbFile as File } from 'modules/filelist/File'
import { buildNextcloudFolderQuery } from 'modules/nextcloud/queries'

interface Props {
  folder: NextcloudFile
  entries: import('./types').File[] // Update with the appropriate type
  navigateTo: (folder?: import('./types').File) => void // Update with the appropriate type
}

const FolderPickerContentNextcloud: React.FC<Props> = ({
  folder,
  entries,
  navigateTo
}) => {
  const nextcloudQuery = buildNextcloudFolderQuery({
    sourceAccount: folder.cozyMetadata.sourceAccount,
    path: folder.path
  })

  const { fetchStatus, data } = useQuery(
    nextcloudQuery.definition,
    nextcloudQuery.options
  ) as {
    fetchStatus: string
    data?: NextcloudFile[]
  }

  const handleFolderOpen = (folder: import('./types').File): void => {
    navigateTo(folder)
  }

  const handleFileOpen = (): void => {
    // Do nothing
  }

  const files = data ?? []

  return (
    <FolderPickerContentExplorer>
      <FolderPickerContentLoader
        fetchStatus={fetchStatus}
        hasNoData={files.length === 0}
      >
        {files.map(file => (
          <File
            key={file.id}
            disabled={isInvalidMoveTarget(entries, file)}
            styleDisabled={isInvalidMoveTarget(entries, file)}
            attributes={file}
            displayedFolder={null}
            actions={null}
            isRenaming={false}
            onFolderOpen={handleFolderOpen}
            onFileOpen={handleFileOpen}
            withSelectionCheckbox={false}
            withFilePath={false}
            withSharedBadge
            disableSelection={true}
          />
        ))}
      </FolderPickerContentLoader>
    </FolderPickerContentExplorer>
  )
}

export { FolderPickerContentNextcloud }
