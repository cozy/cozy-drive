import mime from 'mime-types'

const getMimetypeFromFilename = name => {
  return mime.lookup(name) || 'application/octet-stream'
}

const mappingMimetypeSubtype = {
  word: 'text',
  text: 'text',
  zip: 'zip',
  pdf: 'pdf',
  spreadsheet: 'sheet',
  excel: 'sheet',
  sheet: 'sheet',
  presentation: 'slide',
  powerpoint: 'slide'
}

export const getFileMimetype = (collection, prefix = '') => file => {
  const mimetype =
    file.mime === 'application/octet-stream'
      ? getMimetypeFromFilename(file.name.toLowerCase())
      : file.mime

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
