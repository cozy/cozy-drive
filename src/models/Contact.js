import { getInitials, getDisplayName } from 'cozy-client/dist/models/contact'
import { Contact as DoctypeContact } from 'cozy-doctypes'

class Contact extends DoctypeContact {
  static getInitials(contactOrRecipient, defaultValue = '') {
    if (Contact.isContact(contactOrRecipient)) {
      return getInitials(contactOrRecipient)
    } else {
      const s =
        contactOrRecipient.public_name ||
        contactOrRecipient.name ||
        contactOrRecipient.email
      return (s && s[0].toUpperCase()) || defaultValue
    }
  }

  static getDisplayName(contact, defaultValue = '') {
    if (Contact.isContact(contact)) {
      return getDisplayName(contact)
    } else {
      return (
        contact.public_name || contact.name || contact.email || defaultValue
      )
    }
  }
}

export default Contact
