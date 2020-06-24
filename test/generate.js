const generateFile = ({ i, prefix = 'foobar', type = 'file', ext } = {}) => {
  if (ext === undefined) {
    if (type === 'file') {
      ext = '.pdf'
    } else if (type === 'directory') {
      ext = ''
    }
  }
  return {
    dir_id: 'io.cozy.files.root-dir',
    displayedPath: '/',
    id: `${type}-${prefix}${i}`,
    _id: `${type}-${prefix}${i}`,
    name: `${prefix}${i}${ext}`,
    path: `/${prefix}${i}${ext}`,
    type,
    _type: 'io.cozy.files'
  }
}

export { generateFile }
