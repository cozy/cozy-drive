import {
  downloadEncryptedFile,
  getEncryptionKeyFromDirId,
  isEncryptedFile
} from 'drive/lib/encryption'

export const downloadFile = async (client, file, { vaultClient }) => {
  if (isEncryptedFile(file)) {
    const decryptionKey = await getEncryptionKeyFromDirId(client, file.dir_id)
    return downloadEncryptedFile(client, vaultClient, { file, decryptionKey })
  } else {
    return client.collection('io.cozy.files').download(file)
  }
}
