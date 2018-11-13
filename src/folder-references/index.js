import { DOCTYPE_APPS, DOCTYPE_FILES } from 'drive/lib/doctypes'

export const REF_PHOTOS = `${DOCTYPE_APPS}/photos`
export const REF_UPLOAD = `${DOCTYPE_APPS}/photos/upload`
export const REF_BACKUP = `${DOCTYPE_APPS}/photos/mobile`

export const getReferencedFolders = async (client, reference) => {
  const { included } = await client.collection(DOCTYPE_FILES).findReferencedBy({
    _type: DOCTYPE_APPS,
    _id: reference
  })
  return included.filter(
    folder => /^\/\.cozy_trash/.test(folder.attributes.path) === false
  )
}

export const getOrCreateFolderWithReference = async (
  client,
  path,
  reference
) => {
  const existingFolders = await getReferencedFolders(client, reference)

  if (existingFolders.length) {
    return existingFolders[0]
  } else {
    const collection = client.collection(DOCTYPE_FILES)
    const dirId = await collection.ensureDirectoryExists(path)
    await collection.addReferencesTo(
      {
        _id: reference,
        _type: DOCTYPE_APPS
      },
      [
        {
          _id: dirId
        }
      ]
    )

    const { data: dirInfos } = await collection.get(dirId)

    return dirInfos
  }
}
