import { Contact, Group } from 'cozy-doctypes'

export const DOCTYPE_FILES = 'io.cozy.files'
export const DOCTYPE_ALBUMS = 'io.cozy.photos.albums'
export const DOCTYPE_PHOTOS_SETTINGS = 'io.cozy.photos.settings'
export const DOCTYPE_APPS = 'io.cozy.apps'

export const schema = {
  files: { doctype: DOCTYPE_FILES },
  contacts: { doctype: Contact.doctype },
  groups: { doctype: Group.doctype }
}
