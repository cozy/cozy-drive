import React from 'react'

import { useQuery } from 'cozy-client'

import Explorer from 'drive/web/modules/move/Explorer'
import FileList from 'drive/web/modules/move/FileList'
import Loader from 'drive/web/modules/move/Loader'
import LoadMore from 'drive/web/modules/move/LoadMore'
import { buildMoveOrImportQuery } from 'drive/web/modules/queries'

const MoveModalContent = ({ folderId, entries, navigateTo }) => {
  const contentQuery = buildMoveOrImportQuery(folderId)
  const { fetchStatus, data, hasMore, fetchMore } = useQuery(
    contentQuery.definition,
    contentQuery.options
  )

  const files = data ?? []

  return (
    <Explorer folderId={folderId}>
      <Loader fetchStatus={fetchStatus} hasNoData={files.length === 0}>
        <FileList files={files} targets={entries} navigateTo={navigateTo} />
        <LoadMore hasMore={hasMore} fetchMore={fetchMore} />
      </Loader>
    </Explorer>
  )
}

export { MoveModalContent }
