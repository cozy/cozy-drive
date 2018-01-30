const getPrimaryOrFirst = property => obj => {
  if (!obj[property] || obj[property].length === 0) return ''
  return obj[property].find(property => property.primary) || obj[property][0]
}

// TODO: sadly we have different versions of contacts' doctype to handle...
// A migration tool on the stack side is needed here
export const getPrimaryEmail = contact =>
  Array.isArray(contact.email)
    ? getPrimaryOrFirst('email')(contact).address
    : contact.email

export const getPrimaryCozy = contact =>
  Array.isArray(contact.cozy)
    ? getPrimaryOrFirst('cozy')(contact).url
    : contact.url

export { default as ShareModal } from './ShareModal'
export { default as SharingDetailsModal } from './SharingDetailsModal'
export { default as SharedBadge } from './components/SharedBadge'
export { default as Avatar } from './components/Avatar'
export {
  default as ShareButton,
  SharedByMeButton,
  SharedWithMeButton
} from './components/ShareButton'
