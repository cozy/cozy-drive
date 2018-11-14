import { log, cozyClient } from 'cozy-konnector-libs'

import { DOCTYPE_FILES } from '../../../src/drive/lib/doctypes'
import {
  readSetting,
  defaultParameters,
  createDefaultSetting
} from '../../../src/photos/ducks/clustering/settings'

// Returns the photos metadata sorted by date
const extractInfo = photos => {
  let info = photos
    .map(file => {
      const photo = {
        id: file._id,
        name: file.name
      }
      if (file.metadata) {
        photo.date = file.metadata.datetime
        photo.gps = file.metadata.gps
      } else {
        photo.date = file.created_at
      }
      const hours = new Date(photo.date.slice(0, 19)).getTime() / 1000 / 3600
      photo.timestamp = hours
      return photo
    })
    .sort((pa, pb) => pa.timestamp - pb.timestamp)

  return info
}

// Clusterize the given photos, i.e. organize them depending on metrics
const clusterizePhotos = async (setting, photos) => {
  const dataset = extractInfo(photos)
  const params = defaultParameters(setting)
  if (!params) {
    log('warn', 'No default parameters for clustering found')
    return []
  }

  // TODO add metrics based on params

  return dataset
}

const getNewPhotos = async setting => {
  const lastSeq = setting.lastSeq

  log('info', `Get changes on files since ${lastSeq}`)
  const result = await cozyClient.fetchJSON(
    'GET',
    `/data/${DOCTYPE_FILES}/_changes?include_docs=true&since=${lastSeq}`
  )

  return result.results.map(res => res.doc).filter(doc => {
    return (
      doc.class === 'image' && doc._id.indexOf('_design') !== 0 && !doc.trashed
    )
  })
}

const onPhotoUpload = async () => {
  let setting = await readSetting()
  if (!setting) {
    setting = await createDefaultSetting()
  }
  const photos = await getNewPhotos(setting)
  if (photos) {
    log('info', `Start clustering on ${photos.length} photos`)

    clusterizePhotos(setting, photos)
  }
}

onPhotoUpload()
