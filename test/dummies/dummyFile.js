/**
 * Create a dummy file, with overridden value of given param
 *
 * @param file
 * @returns {*&{path: string, name: string, icon: string, id: string, _id: string, dir_id: string, type: string}}  a dummy file
 */
export const dummyFile = file => ({
  name: 'name',
  id: 'id-file',
  _id: 'id-file',
  icon: 'icon',
  path: '/path',
  type: 'directory',
  ...file
})

/**

 *
 * @param note
 * @returns {*&{path: string, name: string, icon: string, id: string, _id: string, dir_id: string, type: string, metadata: object}}  a dummy note
 */
export const dummyNote = note => ({
  ...dummyFile(),
  type: 'file',
  metadata: {
    content: '',
    schema: '',
    title: '',
    version: ''
  },
  ...note
})
