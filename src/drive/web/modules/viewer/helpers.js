import has from 'lodash/has'

export const hasCertifications = ({ file }) =>
  has(file, 'metadata.carbonCopy') || has(file, 'metadata.electronicSafe')

export const showPanel = ({ file }) => {
  // TODO add rules for connectors

  // for now we just need to return result for certifications
  return hasCertifications({ file })
}
