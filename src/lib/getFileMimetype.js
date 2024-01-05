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

export const getFileMimetype =
  collection =>
  (mime = '', name = '') => {
    const mimetype =
      mime === 'application/octet-stream'
        ? getMimetypeFromFilename(name.toLowerCase())
        : mime
    const [type, subtype] = mimetype.split('/')
    if (collection[type]) {
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
