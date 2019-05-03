import { Contact as DoctypeContact } from 'cozy-doctypes'

class Contact extends DoctypeContact {
  static getInitials(contactOrRecipient) {
    if (Contact.isContact(contactOrRecipient)) {
      return DoctypeContact.getInitials(contactOrRecipient)
    } else {
      const s = contactOrRecipient.public_name || contactOrRecipient.name
      return (s && s[0].toUpperCase()) || ''
    }
  }

  static getDisplayName(contact) {
    if (Contact.isContact(contact)) {
      return DoctypeContact.getDisplayName(contact)
    } else {
      return contact.name || contact.email || ''
    }
  }
}

export default Contact
