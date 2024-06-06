import React from 'react'

import { useQuery, useClient } from 'cozy-client'

import { FolderPickerContentExplorer } from 'components/FolderPicker/FolderPickerContentExplorer'
import { FolderPickerContentLoadMore } from 'components/FolderPicker/FolderPickerContentLoadMore'
import { FolderPickerContentLoader } from 'components/FolderPicker/FolderPickerContentLoader'
import { isInvalidMoveTarget } from 'components/FolderPicker/helpers'
import { isEncryptedFolder } from 'lib/encryption'
import { AddFolderWithoutState } from 'modules/filelist/AddFolder'
import { DumbFile as File } from 'modules/filelist/File'
import { FolderUnlocker } from 'modules/folder/components/FolderUnlocker'
import { buildMoveOrImportQuery, buildOnlyFolderQuery } from 'modules/queries'

const FolderPickerContentCozy = ({
  folder,
  isFolderCreationDisplayed,
  hideFolderCreation,
  entries,
  navigateTo
}) => {
  const client = useClient()
  const contentQuery = buildMoveOrImportQuery(folder._id)
  const {
    fetchStatus,
    data: filesData,
    hasMore,
    fetchMore
  } = useQuery(contentQuery.definition, contentQuery.options)

  const isEncrypted = folder ? isEncryptedFolder(folder) : false
  const files = filesData ?? []

  const handleFolderUnlockerDismiss = async () => {
    const parentFolderQuery = buildOnlyFolderQuery(folder.dir_id)
    const parentFolder = await client.fetchQueryAndGetFromState({
      definition: parentFolderQuery.definition(),
      options: parentFolderQuery.options
    })

    return navigateTo(parentFolder.data)
  }

  return (
    <FolderPickerContentExplorer>
      <AddFolderWithoutState
        isEncrypted={isEncrypted}
        currentFolderId={folder._id}
        visible={isFolderCreationDisplayed}
        afterSubmit={hideFolderCreation}
        afterAbort={hideFolderCreation}
      />
      <FolderPickerContentLoader
        fetchStatus={fetchStatus}
        hasNoData={files.length === 0}
      >
        <FolderUnlocker folder={folder} onDismiss={handleFolderUnlockerDismiss}>
          {files.map(file => (
            <File
              key={file.id}
              disabled={isInvalidMoveTarget(entries, file)}
              styleDisabled={isInvalidMoveTarget(entries, file)}
              attributes={file}
              displayedFolder={null}
              actions={null}
              isRenaming={false}
              onFolderOpen={({ id }) =>
                navigateTo(files.find(f => f.id === id))
              }
              onFileOpen={() => {}}
              withSelectionCheckbox={false}
              withFilePath={false}
              withSharedBadge
              disableSelection={true}
            />
          ))}
        </FolderUnlocker>
        <FolderPickerContentLoadMore hasMore={hasMore} fetchMore={fetchMore} />
      </FolderPickerContentLoader>
    </FolderPickerContentExplorer>
  )
}

export { FolderPickerContentCozy }
