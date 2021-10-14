import has from 'lodash/has'
import {
  downloadEncryptedFile,
  getEncryptionKeyFromDirId,
  isEncryptedFile
} from 'drive/lib/encryption'

export const hasCertifications = ({ file }) =>
  has(file, 'metadata.carbonCopy') || has(file, 'metadata.electronicSafe')

export const isFromKonnector = ({ file }) =>
  has(file, 'cozyMetadata.sourceAccount')

export const showPanel = ({ file }) =>
  hasCertifications({ file }) || isFromKonnector({ file })

export const downloadFile = async (client, file, { vaultClient }) => {
  if (isEncryptedFile(file)) {
    const encryptionKey = await getEncryptionKeyFromDirId(client, file.dir_id)
    return downloadEncryptedFile(client, vaultClient, file, encryptionKey)
  } else {
    return client.collection('io.cozy.files').download(file)
  }
}
