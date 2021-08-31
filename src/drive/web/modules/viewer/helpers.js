import has from 'lodash/has'

export const hasCertifications = ({ file }) =>
  has(file, 'metadata.carbonCopy') || has(file, 'metadata.electronicSafe')

export const isFromKonnector = ({ file }) =>
  has(file, 'cozyMetadata.sourceAccount')

export const showPanel = ({ file }) =>
  hasCertifications({ file }) || isFromKonnector({ file })

const forceFileDownload = (href, filename) => {
  const element = document.createElement('a')
  element.setAttribute('href', href)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export const downloadFile = async (
  client,
  file,
  { vaultClient, encryptionKey }
) => {
  // TODO check vaultclient
  if (encryptionKey) {
    console.log('download file with enc keyu ; ', encryptionKey)
    const resp = await client
      .collection('io.cozy.files')
      .fetchFileContentById(file._id)
    const cipher = await resp.arrayBuffer()
    const decryptedFile = await vaultClient.decryptFile(cipher, encryptionKey)
    const url = URL.createObjectURL(
      new Blob([decryptedFile], { type: file.type })
    )
    return forceFileDownload(url, file.name)
  } else {
    return client.collection('io.cozy.files').download(file)
  }
}
