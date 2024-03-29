import React from 'react'

import { useQuery } from 'cozy-client'

import { isEncryptedFolder } from 'lib/encryption'
import { AddFolderWithoutState } from 'modules/filelist/AddFolder'
import Explorer from 'modules/move/Explorer'
import FileList from 'modules/move/FileList'
import LoadMore from 'modules/move/LoadMore'
import Loader from 'modules/move/Loader'
import { buildMoveOrImportQuery, buildOnlyFolderQuery } from 'modules/queries'

const MoveModalContent = ({
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
    <Explorer folderId={folderId}>
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
    </Explorer>
  )
}

export { MoveModalContent }
