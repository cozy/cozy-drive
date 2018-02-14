const mappingMimetypeSubtype = {
  word: 'text',
  zip: 'zip',
  pdf: 'pdf',
  spreadsheet: 'sheet',
  excel: 'sheet',
  presentation: 'slide',
  powerpoint: 'slide'
}

export const getFileTypeFromMime = (collection, prefix = '') => (
  mimetype = ''
) => {
  const [type, subtype] = mimetype.split('/')
  if (collection[prefix + type]) {
    return type
  }
  if (type === 'application') {
    const existingType = subtype.match(
      Object.keys(mappingMimetypeSubtype).join('|')
    )
    return existingType ? mappingMimetypeSubtype[existingType[0]] : undefined
  }
  return undefined
}
