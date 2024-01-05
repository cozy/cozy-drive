import {
  downloadEncryptedFile,
  getEncryptionKeyFromDirId,
  isEncryptedFile
} from 'lib/encryption'

export const downloadFile = async (client, file, { vaultClient }) => {
  if (isEncryptedFile(file)) {
    const encryptionKey = await getEncryptionKeyFromDirId(client, file.dir_id)
    return downloadEncryptedFile(client, vaultClient, { file, encryptionKey })
  } else {
    return client.collection('io.cozy.files').download(file)
  }
}
