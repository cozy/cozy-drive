import get from 'lodash/get'
import flag from 'cozy-flags'
import { DOCTYPE_FILES, DOCTYPE_FILES_ENCRYPTION } from 'drive/lib/doctypes'
import { buildEncryptionByIdQuery } from 'drive/web/modules/queries'
import { models } from 'cozy-client'
const { isEncrypted } = models.file

export const hasEncryptionRef = dir => {
  return !!getEncryptiondRef(dir)
}

export const getEncryptiondRef = dir => {
  const refs = get(dir, 'referenced_by', [])
  return refs.find(ref => ref.type === DOCTYPE_FILES_ENCRYPTION)
}

export const isEncryptedFile = file => {
  return isEncrypted(file)
}

export const getEncryptionKeyFromDirId = async (client, dirId) => {
  if (!flag('drive.enable-encryption')) {
    return null
  }
  const docId = `${DOCTYPE_FILES}/${dirId}`
  const query = buildEncryptionByIdQuery(docId)
  const res = await client.query(query.definition, { options: query.options })
  return res && res.data ? res.data.key : null
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

export const encryptAndUploadNewFile = async (
  client,
  vaultClient,
  { file, encryptionKey, fileOptions }
) => {
  const { name, dirID, onUploadProgress } = fileOptions
  const encryptedFile = await vaultClient.encryptFile(file, encryptionKey)
  const resp = await client
    .collection(DOCTYPE_FILES)
    .createFile(encryptedFile, {
      name,
      dirId: dirID,
      onUploadProgress,
      encrypted: true
    })
  return resp.data
}

const getBinaryFile = async (client, fileId) => {
  const resp = await client
    .collection(DOCTYPE_FILES)
    .fetchFileContentById(fileId)
  return resp.arrayBuffer()
}

export const decryptFile = async (
  client,
  vaultClient,
  { file, encryptionKey }
) => {
  const cipher = await getBinaryFile(client, file._id)
  const decryptedFile = await vaultClient.decryptFile(cipher, encryptionKey)
  return new Blob([decryptedFile], { type: file.type })
}

export const downloadEncryptedFile = async (
  client,
  vaultClient,
  { file, encryptionKey }
) => {
  const url = await getDecryptedFileURL(client, vaultClient, {
    file,
    encryptionKey
  })
  return client.collection(DOCTYPE_FILES).forceFileDownload(url, file.name)
}

export const getDecryptedFileURL = async (
  client,
  vaultClient,
  { file, encryptionKey }
) => {
  const blob = await decryptFile(client, vaultClient, { file, encryptionKey })
  return URL.createObjectURL(blob)
}
