import ShareModal from './ShareModal'
import SharingDetailsModal from './SharingDetailsModal'

const getPrimaryOrFirst = property => obj => {
  if (!obj[property] || obj[property].length === 0) return ''
  return obj[property].find(property => property.primary) || obj[property][0]
}

export const getPrimaryEmail = contact =>
  getPrimaryOrFirst('email')(contact).address
export const getPrimaryCozy = contact => getPrimaryOrFirst('cozy')(contact).url

export { ShareModal, SharingDetailsModal }
