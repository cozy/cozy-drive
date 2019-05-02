import { Group } from 'cozy-doctypes'

// TODO: sadly we have different versions of contacts' doctype to handle...
// A migration tool on the stack side is needed here
const emailMatch = (input, contact) => {
  if (!contact.email) return false
  const emailInput = new RegExp(input, 'i')
  if (Array.isArray(contact.email)) {
    return contact.email.some(email => emailInput.test(email.address))
  }
  return emailInput.test(contact.email)
}

const cozyUrlMatch = (input, contact) => {
  if (!contact.cozy && !contact.url) return false
  const urlInput = new RegExp(input, 'i')
  if (contact.cozy && Array.isArray(contact.cozy)) {
    return contact.cozy.some(cozy => urlInput.test(cozy.url))
  }
  return urlInput.test(contact.url)
}

const groupNameMatch = (input, contactOrGroup) => {
  if (contactOrGroup._type !== Group.doctype) return false
  const nameInput = new RegExp(input, 'i')
  return nameInput.test(contactOrGroup.name)
}

export { emailMatch, cozyUrlMatch, groupNameMatch }
