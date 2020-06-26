export const generateFile = ({
  i,
  prefix = 'foobar',
  type = 'file',
  ext,
  path = '/',
  dir_id = 'io.cozy.files.root-dir',
  updated_at = ''
} = {}) => {
  if (ext === undefined) {
    if (type === 'file') {
      ext = '.pdf'
    } else if (type === 'directory') {
      ext = ''
    }
  }
  let optionnal = {}
  if (type === 'file') {
    optionnal = {
      ...optionnal,
      size: 10
    }
  }
  if (updated_at !== '') {
    optionnal = {
      ...optionnal,
      updated_at
    }
  }
  return {
    dir_id,
    displayedPath: path,
    id: `${type}-${prefix}${i}`,
    _id: `${type}-${prefix}${i}`,
    name: `${prefix}${i}${ext}`,
    path: `${path === '/' ? '' : path}/${prefix}${i}${ext}`,
    type,
    _type: 'io.cozy.files',
    ...optionnal
  }
}

export const getStoreStateWhenViewingFolder = folderId => {
  return {
    router: {
      params: {
        folderId
      }
    }
  }
}
