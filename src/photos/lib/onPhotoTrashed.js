import { getReferencedBy } from 'cozy-client'
import log from 'cozy-logger'
import pLimit from 'p-limit'

import { buildPhotosTrashedWithReferencedBy } from 'photos/queries/queries'
import { DOCTYPE_ALBUMS, DOCTYPE_FILES } from 'drive/lib/doctypes'

const onPhotoTrashed = async client => {
  const photosTrashedQuery = buildPhotosTrashedWithReferencedBy()
  try {
    const photos = await client.queryAll(
      photosTrashedQuery.definition,
      photosTrashedQuery.options
    )

    if (photos.length > 0) {
      log(
        'info',
        `Start deleting album references on ${photos.length} trashed photos`
      )
      const fileCollection = client.collection(DOCTYPE_FILES)
      const limit = pLimit(20)

      const removePromises = []
      photos.forEach(photo => {
        const ablumsReferenced = getReferencedBy(photo, DOCTYPE_ALBUMS)
        if (ablumsReferenced.length > 0) {
          const albumsReferencedNormalized = ablumsReferenced.map(c => ({
            _id: c.id,
            _type: c.type
          }))
          removePromises.push(
            limit(() =>
              fileCollection.removeReferencedBy(
                photo,
                albumsReferencedNormalized
              )
            )
          )
        }
      })

      await Promise.all(removePromises)
    }
  } catch (e) {
    log('error', 'Failure to delete references with albums on trashed photos')
    log('error', e)
  }
}

export { onPhotoTrashed }
