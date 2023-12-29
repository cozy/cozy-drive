import React from 'react'

import { useQuery } from 'cozy-client'

import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import LoadMore from 'drive/web/modules/move/LoadMore'
import {
  buildMoveOrImportQuery,
  buildOnlyFolderQuery
} from 'drive/web/modules/queries'
import { AddFolderWithoutState } from 'drive/web/modules/filelist/AddFolder'
import { isEncryptedFolder } from 'drive/lib/encryption'

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
