import {
  buildFileOrFolderByIdQuery,
  buildSharedDriveFolderQuery
} from '@/queries'

export const fetchFolder = async ({ client, folderId, driveId }) => {
  const folderQuery = driveId
    ? buildSharedDriveFolderQuery({ driveId, folderId })
    : buildFileOrFolderByIdQuery(folderId)
  const { options, definition } = folderQuery
  const folderQueryResults = await client.fetchQueryAndGetFromState({
    definition: definition(),
    options
  })
  return driveId ? folderQueryResults.data?.[0] : folderQueryResults.data
}
