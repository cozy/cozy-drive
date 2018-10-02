import { DOCTYPE_ALBUMS, DOCTYPE_FILES } from '../../../targets/drive/doctypes'

export default {
  files: {
    doctype: 'io.cozy.files'
  },
  albums: {
    doctype: DOCTYPE_ALBUMS,
    attributes: {
      name: {
        type: 'string',
        unique: true
      }
    },
    relationships: {
      photos: {
        type: 'has-many',
        doctype: DOCTYPE_FILES
      }
    }
  },
  files: {
    doctype: DOCTYPE_FILES
  }
}
