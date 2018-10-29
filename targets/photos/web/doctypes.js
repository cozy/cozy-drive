import {
  DOCTYPE_ALBUMS,
  DOCTYPE_FILES,
  DOCTYPE_CONTACTS
} from 'drive/lib/doctypes'

export default {
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
  },
  contacts: {
    doctype: DOCTYPE_CONTACTS
  }
}
