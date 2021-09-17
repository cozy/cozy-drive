import get from 'lodash/get'
import { DOCTYPE_FILES, DOCTYPE_FILES_ENCRYPTION } from 'drive/lib/doctypes'
import { ENCRYPTION_MIME_TYPE } from 'drive/constants/config'

const unsupporteFilesMimeTypeForEncryption = [
  'text/vnd.cozy.note+markdown',
  'application/vnd.openxmlformats-officedocument',
  'application/internet-shortcut'
]

export const hasEncryptionRef = dir => {
  return getEncryptiondRef(dir) || false
}

export const getEncryptiondRef = dir => {
  const refs = get(dir, 'referenced_by', [])
  return refs.find(ref => ref.type === DOCTYPE_FILES_ENCRYPTION)
}

export const isEncryptedFile = doc => {
  return doc.type === 'file' && doc.mime === ENCRYPTION_MIME_TYPE
}

export const isUnSupportedFileForEncryption = mime => {
  return unsupporteFilesMimeTypeForEncryption.find(unsupportedMime => {
    return mime.includes(unsupportedMime)
  })
}

export const encryptFile = async (vaultClient, file, encryptionKey) => {
  return vaultClient.encryptFile(file, encryptionKey)
}

export const encryptAndUploadNewFile = async (
  client,
  vaultClient,
  file,
  encryptionKey,
  fileOptions
) => {
  const { name, dirID, onUploadProgress } = fileOptions
  const encryptedFile = await encryptFile(vaultClient, file, encryptionKey)
  const resp = await client
    .collection(DOCTYPE_FILES)
    .createFile(encryptedFile, {
      name,
      dirId: dirID,
      onUploadProgress,
      contentType: ENCRYPTION_MIME_TYPE
    })
  return resp.data
}

export const encryptAndUploadExistingFile = async (
  client,
  vaultClient,
  file,
  encryptionKey
) => {
  const clearFile = await getBinaryFile(client, file._id)
  const encryptedFile = await encryptFile(vaultClient, clearFile, encryptionKey)

  const resp = await client
    .collection(DOCTYPE_FILES)
    .updateFile(encryptedFile, {
      name: file.name,
      fileId: file._id,
      contentType: ENCRYPTION_MIME_TYPE
    })
  return resp.data
}

export const decryptAndUploadExistingFile = async (
  client,
  vaultClient,
  file,
  encryptionKey
) => {
  const encryptedFile = await getBinaryFile(client, file._id)
  const clearFile = await decryptFile(vaultClient, encryptedFile, encryptionKey)

  const resp = await client.collection(DOCTYPE_FILES).updateFile(clearFile, {
    name: file.name,
    fileId: file._id
  })
  return resp.data
}

export const reencryptAndUploadExistingFile = async (
  client,
  vaultClient,
  file,
  { encryptionKey, decryptionKey }
) => {
  const encryptedFile = await getBinaryFile(client, file._id)
  const clearFile = await decryptFile(vaultClient, encryptedFile, decryptionKey)
  const reencryptedFile = await encryptFile(
    vaultClient,
    clearFile,
    encryptionKey
  )
  const resp = await client
    .collection(DOCTYPE_FILES)
    .updateFile(reencryptedFile, {
      name: file.name,
      fileId: file._id
    })
  return resp.data
}

export const decryptFile = async (
  vaultClient,
  encryptedFile,
  encryptionKey
) => {
  return vaultClient.decryptFile(encryptedFile, encryptionKey)
}

export const createEncryptedDir = async (
  client,
  vaultClient,
  { name, dirID }
) => {
  // TODO: the relationship is a has-many-file, which is quite confusing and poorly documented
  // Also, the has-many-file is made for albums, we might have problems in fetchMore for instance:
  // https://github.com/cozy/cozy-client/blob/3872bb4981ead5ba7775c7b72cff1bf47bcdeed7/packages/cozy-client/src/associations/HasManyFiles.js#L25

  const { data: dir } = await client.create(DOCTYPE_FILES, {
    name,
    dirId: dirID,
    type: 'directory'
  })

  const docId = `${DOCTYPE_FILES}/${dir._id}`
  const key = await vaultClient.generateEncryptionKey()
  const { data: encryption } = await client.create(DOCTYPE_FILES_ENCRYPTION, {
    _id: docId,
    key: key.encryptedKey.encryptedString
  })
  const hydratedDir = client.hydrateDocument(dir)
  hydratedDir.encryption.addById(encryption._id)
}

const forceFileDownload = (href, filename) => {
  const element = document.createElement('a')
  element.setAttribute('href', href)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const getBinaryFile = async (client, fileId) => {
  const resp = await client
    .collection(DOCTYPE_FILES)
    .fetchFileContentById(fileId)
  return resp.arrayBuffer()
}

export const downloadEncryptedFile = async (
  client,
  vaultClient,
  file,
  encryptionKey
) => {
  const cipher = await getBinaryFile(client, file._id)
  const decryptedFile = await decryptFile(vaultClient, cipher, encryptionKey)
  const url = URL.createObjectURL(
    new Blob([decryptedFile], { type: file.type })
  )
  return forceFileDownload(url, file.name)
}
