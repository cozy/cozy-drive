import React from 'react'

import { useQuery } from 'cozy-client'

import { FolderPickerContentExplorer } from 'components/FolderPicker/FolderPickerContentExplorer'
import { isEncryptedFolder } from 'lib/encryption'
import { AddFolderWithoutState } from 'modules/filelist/AddFolder'
import FileList from 'modules/move/FileList'
import LoadMore from 'modules/move/LoadMore'
import Loader from 'modules/move/Loader'
import { buildMoveOrImportQuery, buildOnlyFolderQuery } from 'modules/queries'

const FolderPickerBody = ({
  folderId,
  entries,
  navigateTo,
  isFolderCreationDisplayed,
  hideFolderCreation
}) => {
  const folderQuery = buildOnlyFolderQuery(folderId)
  const { data: folderData } = useQuery(
    folderQuery.definition,
    folderQuery.options
  )

  const contentQuery = buildMoveOrImportQuery(folderId)
  const {
    fetchStatus,
    data: filesData,
    hasMore,
    fetchMore
  } = useQuery(contentQuery.definition, contentQuery.options)

  const isEncrypted = folderData ? isEncryptedFolder(folderData) : false
  const files = filesData ?? []

  return (
    <FolderPickerContentExplorer folderId={folderId}>
      <AddFolderWithoutState
        isEncrypted={isEncrypted}
        currentFolderId={folderId}
        visible={isFolderCreationDisplayed}
        afterSubmit={hideFolderCreation}
        afterAbort={hideFolderCreation}
      />
      <Loader fetchStatus={fetchStatus} hasNoData={files.length === 0}>
        <FileList files={files} targets={entries} navigateTo={navigateTo} />
        <LoadMore hasMore={hasMore} fetchMore={fetchMore} />
      </Loader>
    </FolderPickerContentExplorer>
  )
}

export { FolderPickerBody }
