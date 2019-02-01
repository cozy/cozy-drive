import { cozyClient, log } from 'cozy-konnector-libs'
import { DOCTYPE_FILES } from 'drive/lib/doctypes'

export const getChanges = async (lastSeq, limit, filteredIds) => {
  log('info', `Get changes on files since ${lastSeq}`)
  const result = await cozyClient.fetchJSON(
    'GET',
    `/data/${DOCTYPE_FILES}/_changes?include_docs=true&since=${lastSeq}`
  )
  // Filter the changes to only get non-trashed images.
  // The filteredIds array is used to skip already clustered files
  const photosChanges = result.results
    .map(res => {
      return { doc: res.doc, seq: res.seq }
    })
    .filter(res => {
      return (
        res.doc.class === 'image' &&
        !res.doc._id.includes('_design') &&
        !res.doc.trashed &&
        !filteredIds.includes(res.doc._id)
      )
    })
    .slice(0, limit)
  //const ids = photosChanges.map(file => file.doc._id)

  const newLastSeq =
    photosChanges.length > 0
      ? photosChanges[photosChanges.length - 1].seq
      : null
  const photos = photosChanges.map(photo => photo.doc)
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
