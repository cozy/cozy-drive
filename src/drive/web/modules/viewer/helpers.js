import { downloadEncryptedFile } from 'drive/lib/encryption'
import has from 'lodash/has'

export const hasCertifications = ({ file }) =>
  has(file, 'metadata.carbonCopy') || has(file, 'metadata.electronicSafe')

export const isFromKonnector = ({ file }) =>
  has(file, 'cozyMetadata.sourceAccount')

export const showPanel = ({ file }) =>
  hasCertifications({ file }) || isFromKonnector({ file })

export const downloadFile = async (
  client,
  file,
  { vaultClient, encryptionKey }
) => {
  if (encryptionKey) {
    return downloadEncryptedFile(client, vaultClient, file, encryptionKey)
  } else {
    return client.collection('io.cozy.files').download(file)
  }
}
