const FILE_TYPE = 'file'
const DIR_TYPE = 'directory'
export const isFile = file => file && file.type === FILE_TYPE
export const isDirectory = file => file && file.type === DIR_TYPE

// selectors
export const getFiles = state => state.view.files
