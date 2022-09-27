import { DOCTYPE_FILES } from 'drive/lib/doctypes'

/**
 * Query all files by filtering on required fields
 *
 * @param {object} client - The CozyClient instance
 * @returns {Promise<Array>} The files array
 */
export const queryAllDocsWithFields = async client => {
  const resp = await client
    .getStackClient()
    .fetchJSON(
      'GET',
      `/data/${DOCTYPE_FILES}/_all_docs?Fields=_id,trashed,name,size,type,cozyMetadata&DesignDocs=false&include_docs=true`
    )
  return resp.rows
}
