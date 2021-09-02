import get from 'lodash/get'

export const isEncryptedDir = dir => {
  const refs = get(dir, 'referenced_by', [])
  return refs.some(ref => ref.type === 'io.cozy.files.encryption')
}

export const encryptFile = async (vaultClient, file, encryptionKey) => {
  return vaultClient.encryptFile(file, encryptionKey)
}

export const decryptFile = async (
  vaultClient,
  encryptedFile,
  encryptionKey
) => {
  return vaultClient.decryptFile(encryptedFile, encryptionKey)
}
