import { cozyClient, log } from 'cozy-konnector-libs'
import { DOCTYPE_ALBUMS } from '../../../drive/lib/doctypes'

// An auto album name is the date of the first photo
const albumName = photos => {
  return photos[0].datetime
}

// An auto album period starts with the first photo and ends with the last one
const albumPeriod = photos => {
  const startDate = photos[0].datetime
  const endDate =
    photos.length > 1 ? photos[photos.length - 1].datetime : startDate
  return { start: startDate, end: endDate }
}

const createReferences = async (album, photos) => {
  try {
    const ids = photos.map(p => p.id)
    const result = await cozyClient.data.addReferencedFiles(album, ids)
    return result
  } catch (e) {
    log('error', e.reason)
  }
}

const createAutoAlbum = async (albums, photos) => {
  if (!photos || photos.length < 1) {
    return null
  }
  // Check if an album already exists for these photos. If not, create it
  const name = albumName(photos)
  const album = albums ? albums.find(album => album.name === name) : null
  if (!album) {
    const created_at = new Date()
    const period = albumPeriod(photos)
    const album = { name, created_at, auto: true, period }
    return await cozyClient.data.create(DOCTYPE_ALBUMS, album)
  }
  return album
}

export const findAllAutoAlbums = async () => {
  const albums = await cozyClient.data.findAll(DOCTYPE_ALBUMS)
  return albums.filter(album => album.auto)
}

// TODO: deal with updates
export const saveClustering = async clusters => {
  const albums = await findAllAutoAlbums()
  for (const photos of clusters) {
    const album = await createAutoAlbum(albums, photos)
    if (album) {
      const refs = await createReferences(album, photos)
      if (refs) {
        log(
          'info',
          `${refs.length} photos clustered into: ${JSON.stringify(album)}`
        )
      }
    }
  }
}
