import has from 'lodash/has'

export const hasCertifications = ({ file }) =>
  has(file, 'metadata.carbonCopy') || has(file, 'metadata.electronicSafe')

export const isFromKonnector = ({ file }) =>
  has(file, 'cozyMetadata.sourceAccount')

export const showPanel = ({ file }) =>
  hasCertifications({ file }) || isFromKonnector({ file })
