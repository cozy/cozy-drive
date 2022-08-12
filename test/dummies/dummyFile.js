// eslint-disable-next-line no-unused-vars
const { IOCozyFile } = require('cozy-client/dist/types')

/**
 * Create a dummy file, with overridden value of given param
 *
 * @param {?IOCozyFile} [file={}] - optional file with value to keep
 * @returns {IOCozyFile} a dummy file
 */
export const dummyFile = file => ({
  _id: 'id-file',
  _type: 'doctype-file',
  name: 'name',
  id: 'id-file',
  icon: 'icon',
  path: '/path',
  type: 'directory',
  ...file
})

/**
 * Create a dummy note, with overridden value of given param
 *
 * @param {?IOCozyFile} [note={}]
 * @returns {IOCozyFile} a dummy note
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
