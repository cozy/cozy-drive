import get from 'lodash/get'
import { buildFolderQuery } from 'modules/queries'

export const fetchFolder = async ({ client, folderId }) => {
  const folderQuery = buildFolderQuery(folderId)
  const { options, definition } = folderQuery
  const folderQueryResults = await client.fetchQueryAndGetFromState({
    definition: definition(),
    options
  })
  return get(folderQueryResults, 'data[0]')
}
