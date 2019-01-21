import { cozyClient, log } from 'cozy-konnector-libs'
import { DOCTYPE_FILES } from 'drive/lib/doctypes'

export const getChanges = async lastSeq => {
  log('info', `Get changes on files since ${lastSeq}`)
  const result = await cozyClient.fetchJSON(
    'GET',
    `/data/${DOCTYPE_FILES}/_changes?include_docs=true&since=${lastSeq}`
  )
  const photos = result.results.map(res => res.doc).filter(doc => {
    return doc.class === 'image' && !doc._id.includes('_design') && !doc.trashed
  })
  const newLastSeq = result.last_seq
  return { photos, newLastSeq }
}

export const getFilesFromDate = async date => {
  // Note a file without a metadata.datetime would not be indexed: this is not
  // a big deal as this is only to compute parameters
  const filesIndex = await cozyClient.data.defineIndex(DOCTYPE_FILES, [
    'metadata.datetime',
    'class',
    'trashed'
  ])
  const selector = {
    'metadata.datetime': { $gt: date },
    class: 'image',
    trashed: false
  }
  return cozyClient.data.query(filesIndex, {
    selector: selector
  })
}
