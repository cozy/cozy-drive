import has from 'lodash/has'

export const hasCertifications = ({ file }) =>
  has(file, 'metadata.carbonCopy') || has(file, 'metadata.electronicSafe')

export const isFromConnector = ({ file }) =>
  has(file, 'cozyMetadata.sourceAccount')

export const showPanel = ({ file }) => {
  return hasCertifications({ file }) || isFromConnector({ file })
}
