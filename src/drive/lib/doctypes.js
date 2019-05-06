import { Contact, Group } from 'models'

export const DOCTYPE_FILES = 'io.cozy.files'
export const DOCTYPE_ALBUMS = 'io.cozy.photos.albums'
export const DOCTYPE_PHOTOS_SETTINGS = 'io.cozy.photos.settings'
export const DOCTYPE_APPS = 'io.cozy.apps'
export const DOCTYPE_CONTACTS_VERSION = 2

export const schema = {
  files: { doctype: DOCTYPE_FILES },
  contacts: {
    doctype: Contact.doctype,
    doctypeVersion: DOCTYPE_CONTACTS_VERSION
  },
  groups: { doctype: Group.doctype }
}
