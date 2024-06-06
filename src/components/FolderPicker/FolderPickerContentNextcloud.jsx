import React from 'react'

import { useQuery } from 'cozy-client'

import { FolderPickerContentExplorer } from 'components/FolderPicker/FolderPickerContentExplorer'
import { FolderPickerContentLoader } from 'components/FolderPicker/FolderPickerContentLoader'
import { isInvalidMoveTarget } from 'components/FolderPicker/helpers'
import { DumbFile as File } from 'modules/filelist/File'
import { buildNextcloudFolderQuery } from 'modules/nextcloud/queries'

const FolderPickerContentNextcloud = ({ folder, entries, navigateTo }) => {
  const nextcloudQuery = buildNextcloudFolderQuery({
    sourceAccount: folder.cozyMetadata.sourceAccount,
    path: folder.path
  })

  const { fetchStatus, data: files } = useQuery(
    nextcloudQuery.definition,
    nextcloudQuery.options
  )

  const handleFolderOpen = async folder => {
    navigateTo(folder)
  }

  return (
    <FolderPickerContentExplorer>
      <FolderPickerContentLoader
        fetchStatus={fetchStatus}
        hasNoData={files?.length === 0}
      >
        {(files ?? []).map(file => (
          <File
            key={file.id}
            disabled={isInvalidMoveTarget(entries, file)}
            styleDisabled={isInvalidMoveTarget(entries, file)}
            attributes={file}
            displayedFolder={null}
            actions={null}
            isRenaming={false}
            onFolderOpen={handleFolderOpen}
            onFileOpen={() => {}}
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
