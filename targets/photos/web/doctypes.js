export default {
  files: {
    doctype: 'io.cozy.files'
  },
  albums: {
    doctype: 'io.cozy.photos.albums',
    attributes: {
      name: {
        type: 'string',
        unique: true
      }
    },
    relationships: {
      photos: {
        type: 'has-many',
        doctype: 'io.cozy.files'
      }
    }
  }
}
