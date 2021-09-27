import get from 'lodash/get'
import { DOCTYPE_FILES, DOCTYPE_FILES_ENCRYPTION } from 'drive/lib/doctypes'

export const hasEncryptionRef = dir => {
  return !!getEncryptiondRef(dir)
}

export const getEncryptiondRef = dir => {
  const refs = get(dir, 'referenced_by', [])
  return refs.find(ref => ref.type === DOCTYPE_FILES_ENCRYPTION)
}

export const createEncryptedDir = async (
  client,
  vaultClient,
  { name, dirID }
) => {
  // Create the directory
  const { data: dir } = await client.create(DOCTYPE_FILES, {
    name,
    dirId: dirID,
    type: 'directory'
  })

  // Create the encryption key
  const docId = `${DOCTYPE_FILES}/${dir._id}`
  const key = await vaultClient.generateEncryptionKey()
  const { data: encryption } = await client.create(DOCTYPE_FILES_ENCRYPTION, {
    _id: docId,
    key: key.encryptedKey.encryptedString
  })

  // Add the relationship
  const hydratedDir = client.hydrateDocument(dir)
  return hydratedDir.encryption.addById(encryption._id)
}
