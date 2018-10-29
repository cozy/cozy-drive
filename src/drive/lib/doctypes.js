export const DOCTYPE_FILES = 'io.cozy.files'
export const DOCTYPE_CONTACTS = 'io.cozy.contacts'
export const DOCTYPE_ALBUMS = 'io.cozy.photos.albums'
export const DOCTYPE_APPS = 'io.cozy.apps'
export const DOCTYPE_REF_PHOTOS = `${DOCTYPE_APPS}/photos`
export const DOCTYPE_REF_BACKUP = `${DOCTYPE_APPS}/photos/mobile`

export const schema = {
  files: { doctype: DOCTYPE_FILES },
  contacts: { doctype: DOCTYPE_CONTACTS }
}
